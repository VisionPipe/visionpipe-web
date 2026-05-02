import { sql, and, eq, inArray } from 'drizzle-orm';
import { db } from './client';
import { purchases } from './schema';

/**
 * Sum of unexpired, non-refunded credits for the org. Returns 0 when the
 * org has no qualifying purchases (which also means "org not found" is
 * indistinguishable from "org has zero balance" — callers that need to
 * verify org existence must do so separately).
 */
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
        sql`${purchases.expiresAt} > NOW()`
      )
    );
  return result[0]?.total ?? 0;
}
