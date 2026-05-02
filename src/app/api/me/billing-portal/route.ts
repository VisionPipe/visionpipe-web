import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/db/client';
import { memberships, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [m] = await db.select().from(memberships).where(eq(memberships.clerkUserId, userId)).limit(1);
  if (!m) return NextResponse.json({ error: 'no org' }, { status: 404 });

  const [org] = await db.select().from(organizations).where(eq(organizations.id, m.orgId)).limit(1);
  if (!org?.stripeCustomerId) {
    return NextResponse.json({ error: 'no stripe customer' }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
