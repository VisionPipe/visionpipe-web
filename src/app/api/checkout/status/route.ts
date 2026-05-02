import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { purchases } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

  return NextResponse.json({
    status: purchase.status === 'complete' ? 'complete' : 'pending',
    credits: purchase.creditsPurchased,
    sku: purchase.sku,
  });
}
