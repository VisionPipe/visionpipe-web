import { NextResponse } from 'next/server';
import Stripe from 'stripe';
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

  // Idempotency: insert event row, skip if already processed
  const inserted = await db
    .insert(webhookEvents)
    .values({ stripeEventId: event.id, eventType: event.type, payload: event as any })
    .onConflictDoNothing()
    .returning();

  if (inserted.length === 0) {
    return NextResponse.json({ received: true, deduped: true });
  }

  // Dispatch by event type — handlers added in Tasks E5, E6, E7
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

  return NextResponse.json({ received: true });
}
