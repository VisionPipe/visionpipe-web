import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../client';
import { organizations, purchases } from '../schema';
import { getBalance } from '../queries';

describe('getBalance', () => {
  let testOrgId: number;

  beforeEach(async () => {
    // Clean and seed
    await db.delete(purchases);
    await db.delete(organizations);
    const [org] = await db.insert(organizations).values({
      clerkOrgId: `test_${Date.now()}`,
      type: 'personal',
    }).returning();
    testOrgId = org.id;
  });

  it('returns 0 for an org with no purchases', async () => {
    const balance = await getBalance(testOrgId);
    expect(balance).toBe(0);
  });

  it('sums credits from complete unexpired purchases', async () => {
    await db.insert(purchases).values({
      orgId: testOrgId,
      sku: 'pack_10',
      creditsPurchased: 1000,
      amountCents: 1000,
      status: 'complete',
      expiresAt: new Date(Date.now() + 86400 * 1000),
    });
    const balance = await getBalance(testOrgId);
    expect(balance).toBe(1000);
  });

  it('subtracts refunded credits', async () => {
    await db.insert(purchases).values({
      orgId: testOrgId,
      sku: 'pack_10',
      creditsPurchased: 1000,
      amountCents: 1000,
      refundedCredits: 200,
      status: 'partially_refunded',
      expiresAt: new Date(Date.now() + 86400 * 1000),
    });
    const balance = await getBalance(testOrgId);
    expect(balance).toBe(800);
  });

  it('excludes expired purchases', async () => {
    await db.insert(purchases).values({
      orgId: testOrgId,
      sku: 'pack_10',
      creditsPurchased: 1000,
      amountCents: 1000,
      status: 'complete',
      expiresAt: new Date(Date.now() - 86400 * 1000), // expired yesterday
    });
    const balance = await getBalance(testOrgId);
    expect(balance).toBe(0);
  });

  it('excludes pending purchases', async () => {
    await db.insert(purchases).values({
      orgId: testOrgId,
      sku: 'pack_10',
      creditsPurchased: 1000,
      amountCents: 1000,
      status: 'pending',
      expiresAt: new Date(Date.now() + 86400 * 1000),
    });
    const balance = await getBalance(testOrgId);
    expect(balance).toBe(0);
  });
});
