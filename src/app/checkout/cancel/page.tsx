import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-forest p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-cream">Payment cancelled</h1>
        <p className="mt-4 text-muted">No charges were made.</p>
        <Link href="/pricing#credit-packs" className="mt-6 inline-block rounded bg-teal px-6 py-3 font-semibold text-cream hover:bg-teal/90">
          Back to pricing
        </Link>
      </div>
    </div>
  );
}
