import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/client';
import { memberships } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getBalance } from '@/db/queries';

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [m] = await db.select().from(memberships).where(eq(memberships.clerkUserId, userId)).limit(1);
  if (!m) return NextResponse.json({ balance: 0 });

  const balance = await getBalance(m.orgId);
  return NextResponse.json({ balance });
}
