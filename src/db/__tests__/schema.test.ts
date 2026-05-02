import { describe, expect, it } from 'vitest';
import { organizations, memberships, purchases, webhookEvents } from '../schema';

describe('schema', () => {
  it('exports all four tables', () => {
    expect(organizations).toBeDefined();
    expect(memberships).toBeDefined();
    expect(purchases).toBeDefined();
    expect(webhookEvents).toBeDefined();
  });

  it('purchases has expires_at column', () => {
    const cols = Object.keys(purchases);
    expect(cols).toContain('expiresAt');
  });

  it('organizations has clerk_org_id and stripe_customer_id', () => {
    const cols = Object.keys(organizations);
    expect(cols).toContain('clerkOrgId');
    expect(cols).toContain('stripeCustomerId');
  });
});
