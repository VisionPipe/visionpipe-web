import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/client';
import { memberships, purchases } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [m] = await db.select().from(memberships).where(eq(memberships.clerkUserId, userId)).limit(1);
  if (!m) return NextResponse.json({ purchases: [] });

  const rows = await db
    .select()
    .from(purchases)
    .where(eq(purchases.orgId, m.orgId))
    .orderBy(desc(purchases.createdAt));

  return NextResponse.json({ purchases: rows });
}
