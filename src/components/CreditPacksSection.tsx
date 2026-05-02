import { PACKS } from '@/lib/pricing';
import { CreditPackCard } from './CreditPackCard';

const BONUSES: Record<string, number> = {
  pack_10: 0,
  pack_20: 10,
  pack_50: 15,
  pack_100: 20,
};

export function CreditPacksSection() {
  return (
    <section id="credit-packs" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">Credit Packs</h2>
        <p className="mt-4 text-center text-muted">Buy once, use within 12 months. No subscription.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(PACKS).map((pack) => (
            <CreditPackCard key={pack.sku} pack={pack} bonusPercent={BONUSES[pack.sku] ?? 0} />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Credits expire 12 months after purchase. Refunds available within 30 days on unused credits — email{' '}
          <a href="mailto:hello@visionpipe.ai" className="text-teal hover:underline">hello@visionpipe.ai</a>.
        </p>
      </div>
    </section>
  );
}
