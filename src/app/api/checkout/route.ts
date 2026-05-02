import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { getPack, isValidSku } from '@/lib/pricing';
import { db } from '@/db/client';
import { organizations, memberships } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { sku } = await req.json().catch(() => ({}));
  if (!isValidSku(sku)) {
    return NextResponse.json({ error: 'invalid sku' }, { status: 400 });
  }
  const pack = getPack(sku)!;

  const { userId } = await auth();
  let orgId: number | undefined;
  let stripeCustomerId: string | undefined;

  if (userId) {
    const m = await db.select().from(memberships).where(eq(memberships.clerkUserId, userId)).limit(1);
    if (m.length > 0) {
      const [org] = await db.select().from(organizations).where(eq(organizations.id, m[0].orgId)).limit(1);
      if (org) {
        orgId = org.id;
        stripeCustomerId = org.stripeCustomerId ?? undefined;
      }
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: pack.priceId, quantity: 1 }],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
    // automatic_tax: { enabled: true }, // Requires head office address in Stripe Tax settings; enable after configuring https://dashboard.stripe.com/test/settings/tax
    customer: stripeCustomerId,
    customer_email: stripeCustomerId ? undefined : undefined,
    metadata: {
      sku: pack.sku,
      credits: String(pack.credits),
      amountCents: String(pack.amountCents),
      ...(orgId ? { orgId: String(orgId) } : {}),
    },
  });

  return NextResponse.json({ url: session.url });
}
