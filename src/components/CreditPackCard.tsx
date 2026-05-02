'use client';

import { useState } from 'react';
import type { Pack } from '@/lib/pricing';

interface Props {
  pack: Pack;
  bonusPercent: number; // 0, 10, 15, 20
}

export function CreditPackCard({ pack, bonusPercent }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: pack.sku }),
      });
      if (!res.ok) throw new Error('Checkout failed');
      const { url } = await res.json();
      window.location.href = url;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  const dollarPrice = (pack.amountCents / 100).toFixed(0);
  const perCredit = (pack.amountCents / pack.credits / 100).toFixed(4);

  return (
    <div className="rounded-lg border border-white/10 bg-deep-forest p-6 flex flex-col">
      <h3 className="text-2xl font-bold text-cream">{pack.credits.toLocaleString()} credits</h3>
      <p className="mt-2 text-4xl font-bold text-teal">${dollarPrice}</p>
      <p className="mt-1 text-sm text-muted">${perCredit} per credit</p>
      {bonusPercent > 0 && (
        <p className="mt-2 text-sm font-semibold text-amber">+{bonusPercent}% bonus</p>
      )}
      <button
        onClick={handleBuy}
        disabled={loading}
        className="mt-6 rounded bg-teal px-4 py-2 font-semibold text-cream hover:bg-teal/90 disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : `Buy ${pack.credits.toLocaleString()} credits`}
      </button>
      {error && <p className="mt-2 text-sm text-burnt-sienna">{error}</p>}
    </div>
  );
}
