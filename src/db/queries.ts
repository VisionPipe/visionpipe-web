import { sql, and, eq, gt, inArray } from 'drizzle-orm';
import { db } from './client';
import { purchases } from './schema';

export async function getBalance(orgId: number): Promise<number> {
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${purchases.creditsPurchased} - ${purchases.refundedCredits}), 0)::int`,
    })
    .from(purchases)
    .where(
      and(
        eq(purchases.orgId, orgId),
        inArray(purchases.status, ['complete', 'partially_refunded']),
        gt(purchases.expiresAt, new Date())
      )
    );
  return result[0]?.total ?? 0;
}
