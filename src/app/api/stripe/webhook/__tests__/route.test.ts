import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

describe('POST /api/stripe/webhook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 400 when stripe-signature header is missing', async () => {
    const req = new Request('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when signature does not verify', async () => {
    const req = new Request('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid' },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
