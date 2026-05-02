import Link from 'next/link';
import { PurchaseHistory } from '@/components/PurchaseHistory';

export default function PurchasesPage() {
  return (
    <div className="min-h-screen bg-forest p-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-sm text-teal hover:underline">← Back to dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold text-cream">All purchases</h1>
        <div className="mt-8 overflow-x-auto">
          <PurchaseHistory />
        </div>
      </div>
    </div>
  );
}
