import { describe, it, expect } from 'vitest';
import { formatNumber, formatCoins, getTotalExpense } from '../economy';
import { GameState } from '../types';

describe('formatNumber', () => {
  it('formats numbers < 1000 without suffix', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(5)).toBe('5');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands as k', () => {
    expect(formatNumber(1000)).toBe('1.0k');
    expect(formatNumber(1500)).toBe('1.5k');
    expect(formatNumber(999999)).toBe('1000.0k');
  });

  it('formats millions as M', () => {
    expect(formatNumber(1_000_000)).toBe('1.0M');
    expect(formatNumber(2_500_000)).toBe('2.5M');
  });

  it('formats up to Oc', () => {
    expect(formatNumber(1e27)).toBe('1.0Oc');
  });
});

describe('formatCoins', () => {
  it('returns only copper for small amounts', () => {
    const tiers = formatCoins(50);
    expect(tiers).toEqual([{ label: 'c', value: 50, color: '#a15c2f' }]);
  });

  it('includes silver for amounts >= 100', () => {
    const tiers = formatCoins(150);
    expect(tiers.find(t => t.label === 's')?.value).toBe(1);
    expect(tiers.find(t => t.label === 'c')?.value).toBe(50);
  });

  it('includes gold for amounts >= 10000', () => {
    const tiers = formatCoins(25000);
    expect(tiers.find(t => t.label === 'g')?.value).toBe(2);
    expect(tiers.find(t => t.label === 's')?.value).toBe(50);
  });

  it('includes platinum for amounts >= 1M', () => {
    const tiers = formatCoins(1_500_000);
    expect(tiers.find(t => t.label === 'p')?.value).toBe(1);
    expect(tiers.find(t => t.label === 'g')?.value).toBe(50);
  });
});

describe('getTotalExpense', () => {
  it('returns 0 for homeless with no misc items', () => {
    const state = { player: { currentPropertyId: 'homeless', currentMiscIds: [] } } as GameState;
    expect(getTotalExpense(state)).toBe(0);
  });

  it('sums property and misc expenses', () => {
    const state = { player: { currentPropertyId: 'tent', currentMiscIds: ['ragClothing'] } } as GameState;
    expect(getTotalExpense(state)).toBe(18);
  });
});
