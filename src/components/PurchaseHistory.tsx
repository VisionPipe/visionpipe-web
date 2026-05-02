'use client';
import { useEffect, useState } from 'react';

interface Purchase {
  id: number;
  sku: string;
  creditsPurchased: number;
  amountCents: number;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export function PurchaseHistory({ limit }: { limit?: number }) {
  const [rows, setRows] = useState<Purchase[]>([]);

  useEffect(() => {
    fetch('/api/me/purchases').then(r => r.json()).then(d => setRows(d.purchases ?? []));
  }, []);

  const display = limit ? rows.slice(0, limit) : rows;

  if (rows.length === 0) {
    return <p className="text-muted">No purchases yet.</p>;
  }

  return (
    <table className="w-full text-cream">
      <thead className="text-left text-sm uppercase tracking-wider text-muted">
        <tr>
          <th className="py-2">Date</th>
          <th className="py-2">Pack</th>
          <th className="py-2">Credits</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Status</th>
          <th className="py-2">Expires</th>
        </tr>
      </thead>
      <tbody>
        {display.map(p => (
          <tr key={p.id} className="border-t border-white/5">
            <td className="py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
            <td className="py-3">{p.sku}</td>
            <td className="py-3">{p.creditsPurchased.toLocaleString()}</td>
            <td className="py-3">${(p.amountCents / 100).toFixed(2)}</td>
            <td className="py-3">{p.status}</td>
            <td className="py-3">{new Date(p.expiresAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
