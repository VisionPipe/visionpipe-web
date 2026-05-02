import Link from 'next/link';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { PurchaseHistory } from '@/components/PurchaseHistory';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-forest p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-cream">Dashboard</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <BalanceDisplay />
          <div className="rounded-lg border border-white/10 bg-deep-forest p-8 flex flex-col justify-between">
            <p className="text-sm uppercase tracking-wider text-muted">Need more credits?</p>
            <Link
              href="/pricing#credit-packs"
              className="mt-4 inline-block rounded bg-teal px-6 py-3 font-semibold text-cream hover:bg-teal/90"
            >
              Buy more credits →
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-cream">Recent purchases</h2>
            <Link href="/dashboard/purchases" className="text-sm text-teal hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <PurchaseHistory limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
