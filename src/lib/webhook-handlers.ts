import type Stripe from 'stripe';
import { db } from '@/db/client';
import { organizations, memberships, purchases } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
