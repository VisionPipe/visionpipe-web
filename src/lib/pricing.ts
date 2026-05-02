export type PackSku = 'pack_10' | 'pack_20' | 'pack_50' | 'pack_100';

export interface Pack {
  sku: PackSku;
  priceId: string;
  credits: number;
  amountCents: number;
  displayName: string;
}

export const PACKS: Record<PackSku, Pack> = {
  pack_10:  { sku: 'pack_10',  priceId: process.env.STRIPE_PRICE_PACK_10!,  credits: 1000,  amountCents: 1000,  displayName: '1,000 credits' },
  pack_20:  { sku: 'pack_20',  priceId: process.env.STRIPE_PRICE_PACK_20!,  credits: 2200,  amountCents: 2000,  displayName: '2,200 credits' },
  pack_50:  { sku: 'pack_50',  priceId: process.env.STRIPE_PRICE_PACK_50!,  credits: 5750,  amountCents: 5000,  displayName: '5,750 credits' },
  pack_100: { sku: 'pack_100', priceId: process.env.STRIPE_PRICE_PACK_100!, credits: 12000, amountCents: 10000, displayName: '12,000 credits' },
};

export function isValidSku(value: unknown): value is PackSku {
  return typeof value === 'string' && value in PACKS;
}

export function getPack(sku: string): Pack | undefined {
  return isValidSku(sku) ? PACKS[sku] : undefined;
}
