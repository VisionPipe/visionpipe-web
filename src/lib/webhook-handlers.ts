import type Stripe from 'stripe';
import { db } from '@/db/client';
import { organizations, memberships, purchases } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendDisputeAlert } from './email';
import { getPack, isValidSku } from './pricing';
import { findOrCreateUserByEmail, findOrCreateOrgForUser, createSignInToken } from './clerk-backend';
import { sendMagicLink } from './email';

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const sku = session.metadata?.sku;
  if (!isValidSku(sku)) throw new Error(`invalid or missing sku in metadata: ${sku}`);
  const pack = getPack(sku)!;

  if (session.amount_total !== pack.amountCents) {
    throw new Error(`amount mismatch: expected ${pack.amountCents} got ${session.amount_total}`);
  }

  const email = session.customer_details?.email;
  if (!email) throw new Error('no email on session');

  const user = await findOrCreateUserByEmail(email);
  const clerkOrg = await findOrCreateOrgForUser(user.id, user.firstName ?? email.split('@')[0]);

  let [org] = await db.select().from(organizations).where(eq(organizations.clerkOrgId, clerkOrg.id)).limit(1);
  if (!org) {
    [org] = await db.insert(organizations).values({
      clerkOrgId: clerkOrg.id,
      type: 'personal',
      name: clerkOrg.name,
    }).returning();
    await db.insert(memberships).values({
      orgId: org.id,
      clerkUserId: user.id,
      role: 'owner',
    });
  }

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 12);

  await db.insert(purchases).values({
    orgId: org.id,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
    sku: pack.sku,
    creditsPurchased: pack.credits,
    amountCents: pack.amountCents,
    currency: session.currency ?? 'usd',
    status: 'complete',
    refundedCredits: 0,
    expiresAt,
    completedAt: new Date(),
  }).onConflictDoNothing();

  const token = await createSignInToken(user.id);
  await sendMagicLink(email, token.url ?? '');
}

export async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const piId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
  if (!piId) return;

  const [purchase] = await db.select().from(purchases).where(eq(purchases.stripePaymentIntentId, piId)).limit(1);
  if (!purchase) {
    console.warn(`refund webhook for unknown payment intent ${piId}`);
    return;
  }

  const refundedCents = charge.amount_refunded;
  const fullyRefunded = refundedCents >= purchase.amountCents;
  const refundedCreditsProportional = Math.floor(purchase.creditsPurchased * (refundedCents / purchase.amountCents));

  await db.update(purchases)
    .set({
      status: fullyRefunded ? 'refunded' : 'partially_refunded',
      refundedCredits: refundedCreditsProportional,
    })
    .where(eq(purchases.id, purchase.id));
}

export async function handleDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
  console.warn(`Dispute created: ${dispute.id} amount=${dispute.amount} reason=${dispute.reason}`);
  await sendDisputeAlert(dispute.id, dispute.amount);
}
