import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';
import { db } from '@/db/client';
import { webhookEvents } from '@/db/schema';
import { handleCheckoutCompleted, handleChargeRefunded, handleDisputeCreated } from '@/lib/webhook-handlers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'missing signature' }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  // Idempotency claim. If the event was already processed (row exists), return
  // early. If we claim it but the dispatch fails, we MUST delete the row in
  // the catch below so Stripe's retry can re-attempt — otherwise a transient
  // error (network blip, Clerk hiccup) gets stuck as "received but never run."
  const inserted = await db
    .insert(webhookEvents)
    .values({ stripeEventId: event.id, eventType: event.type, payload: event as any })
    .onConflictDoNothing()
    .returning();

  if (inserted.length === 0) {
    return NextResponse.json({ received: true, deduped: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;
      case 'payment_intent.payment_failed':
        console.log('payment_intent.payment_failed', event.data.object.id);
        break;
      default:
        break;
    }
  } catch (err) {
    await db.delete(webhookEvents).where(eq(webhookEvents.id, inserted[0].id));
    const e = err as { clerkError?: boolean; status?: number; errors?: unknown; message?: string };
    console.error('Webhook handler failed; rolled back idempotency row', {
      eventId: event.id,
      eventType: event.type,
      message: e?.message,
      clerkError: e?.clerkError,
      clerkStatus: e?.status,
      clerkErrors: e?.errors,
    });
    throw err;
  }

  return NextResponse.json({ received: true });
}
