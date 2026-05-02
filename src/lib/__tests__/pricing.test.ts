import { describe, it, expect } from 'vitest';
import { PACKS, getPack, isValidSku } from '../pricing';

describe('PACKS', () => {
  it('exposes 4 packs', () => {
    expect(Object.keys(PACKS)).toEqual(['pack_10', 'pack_20', 'pack_50', 'pack_100']);
  });

  it('matches the spec amounts', () => {
    expect(PACKS.pack_10.amountCents).toBe(1000);
    expect(PACKS.pack_10.credits).toBe(1000);
    expect(PACKS.pack_20.credits).toBe(2200);
    expect(PACKS.pack_50.credits).toBe(5750);
    expect(PACKS.pack_100.credits).toBe(12000);
  });
});

describe('getPack', () => {
  it('returns the pack metadata for a valid SKU', () => {
    const pack = getPack('pack_20');
    expect(pack).toBeDefined();
    expect(pack?.credits).toBe(2200);
  });

  it('returns undefined for an invalid SKU', () => {
    expect(getPack('pack_999')).toBeUndefined();
  });
});

describe('isValidSku', () => {
  it('returns true for known SKUs', () => {
    expect(isValidSku('pack_10')).toBe(true);
    expect(isValidSku('pack_100')).toBe(true);
  });

  it('returns false for unknown strings', () => {
    expect(isValidSku('pack_999')).toBe(false);
    expect(isValidSku('')).toBe(false);
    expect(isValidSku(null)).toBe(false);
  });
});
