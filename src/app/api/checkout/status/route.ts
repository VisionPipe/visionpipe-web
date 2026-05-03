import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { purchases } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'missing session_id' }, { status: 400 });
  }

  const [purchase] = await db
    .select()
    .from(purchases)
    .where(eq(purchases.stripeCheckoutSessionId, sessionId))
    .limit(1);

  if (!purchase) {
    return NextResponse.json({ status: 'pending' });
  }

  // Only pull the email from Stripe once we have a row — keeps polling cheap
  // while the webhook is still processing, and avoids a Stripe call per poll.
  let email: string | null = null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    email = session.customer_details?.email ?? null;
  } catch {
    // Non-fatal: success page falls back to "your account" copy if email is null
  }

  return NextResponse.json({
    status: purchase.status === 'complete' ? 'complete' : 'pending',
    credits: purchase.creditsPurchased,
    sku: purchase.sku,
    email,
  });
}
