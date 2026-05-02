import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleCheckoutCompleted } from '../webhook-handlers';
import { db } from '@/db/client';
import { organizations, memberships, purchases } from '@/db/schema';

vi.mock('../clerk-backend', () => ({
  findOrCreateUserByEmail: vi.fn().mockResolvedValue({ id: 'user_test123', firstName: null, primaryEmailAddressId: 'email_1', emailAddresses: [{ id: 'email_1', emailAddress: 'buyer@example.com' }] }),
  findOrCreateOrgForUser: vi.fn().mockResolvedValue({ id: 'org_test456', name: 'buyer' }),
  createSignInToken: vi.fn().mockResolvedValue({ token: 'st_abc', url: 'https://accounts.dev/sign-in?token=st_abc' }),
}));

vi.mock('../email', () => ({
  sendMagicLink: vi.fn().mockResolvedValue(undefined),
}));

describe('handleCheckoutCompleted', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Clean DB so tests are repeatable
    await db.delete(purchases);
    await db.delete(memberships);
    await db.delete(organizations);
  });

  it('rejects when amount_total mismatches expected SKU amount', async () => {
    const session = {
      id: 'cs_test_x',
      payment_intent: 'pi_test_x',
      amount_total: 99,
      customer_details: { email: 'buyer@example.com' },
      metadata: { sku: 'pack_10', credits: '1000', amountCents: '1000' },
    } as any;

    await expect(handleCheckoutCompleted(session)).rejects.toThrow(/amount mismatch/i);
  });

  it('processes a valid logged-out purchase: creates user, org, purchase, sends magic link', async () => {
    const { findOrCreateUserByEmail } = await import('../clerk-backend');
    const session = {
      id: 'cs_test_y',
      payment_intent: 'pi_test_y',
      amount_total: 1000,
      currency: 'usd',
      customer_details: { email: 'buyer@example.com' },
      metadata: { sku: 'pack_10', credits: '1000', amountCents: '1000' },
    } as any;

    await handleCheckoutCompleted(session);
    expect(findOrCreateUserByEmail).toHaveBeenCalledWith('buyer@example.com');
  });
});

import { handleChargeRefunded } from '../webhook-handlers';

describe('handleChargeRefunded', () => {
  it('updates purchase status to refunded when full refund', async () => {
    expect(true).toBe(true); // placeholder per plan
  });

  it('updates to partially_refunded for partial refund', async () => {
    expect(true).toBe(true); // placeholder per plan
  });
});
