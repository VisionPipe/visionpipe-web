'use client';
import { useEffect, useState } from 'react';

export function BalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/me/balance').then(r => r.json()).then(d => setBalance(d.balance));
  }, []);

  return (
    <div className="rounded-lg border border-white/10 bg-deep-forest p-8">
      <p className="text-sm uppercase tracking-wider text-muted">Current balance</p>
      <p className="mt-2 text-5xl font-bold text-teal">
        {balance === null ? '—' : balance.toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-muted">credits</p>
    </div>
  );
}
