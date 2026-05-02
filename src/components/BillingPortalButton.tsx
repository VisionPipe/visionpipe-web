'use client';

export function BillingPortalButton() {
  return (
    <button
      onClick={async () => {
        const res = await fetch('/api/me/billing-portal', { method: 'POST' });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }}
      className="rounded border border-white/20 px-4 py-2 text-cream hover:bg-deep-forest"
    >
      Manage Billing →
    </button>
  );
}
