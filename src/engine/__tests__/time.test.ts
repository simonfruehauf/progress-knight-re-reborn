import { describe, it, expect } from 'vitest';
import { getBaseLog, getMaxXp, getBargainingEffect, getIntimidationEffect } from '../time';
import { GameState } from '../types';

describe('getBaseLog', () => {
  it('returns 0 for x <= 0', () => {
    expect(getBaseLog(10, 0)).toBe(0);
    expect(getBaseLog(10, -5)).toBe(0);
  });

  it('computes log base 10 correctly', () => {
    expect(getBaseLog(10, 100)).toBeCloseTo(2, 5);
  });
});

describe('getMaxXp', () => {
  it('scales with level', () => {
    const result = getMaxXp(100, 0);
    expect(result).toBeGreaterThanOrEqual(100);
  });

  it('grows exponentially with level', () => {
    const lvl0 = getMaxXp(100, 0);
    const lvl10 = getMaxXp(100, 10);
    expect(lvl10).toBeGreaterThan(lvl0 * 10);
  });
});

describe('getBargainingEffect', () => {
  it('returns 1 with no levels', () => {
    const state = { player: {}, skills: { bargaining: { level: 0 } } } as unknown as GameState;
    const effect = getBargainingEffect(state);
    expect(effect).toBeGreaterThanOrEqual(0.9);
    expect(effect).toBeLessThanOrEqual(1);
  });

  it('reduces expenses with levels', () => {
    const state0 = { player: {}, skills: { bargaining: { level: 0 } } } as unknown as GameState;
    const state10 = { player: {}, skills: { bargaining: { level: 10 } } } as unknown as GameState;
    expect(getBargainingEffect(state10)).toBeLessThan(getBargainingEffect(state0));
  });

  it('floors at 0.1', () => {
    const state = { player: {}, skills: { bargaining: { level: 99999999999 } } } as unknown as GameState;
    expect(getBargainingEffect(state)).toBe(0.1);
  });
});

describe('getIntimidationEffect', () => {
  it('behaves like bargaining', () => {
    const state = { player: {}, skills: { intimidation: { level: 0 } } } as unknown as GameState;
    expect(getIntimidationEffect(state)).toBeGreaterThanOrEqual(0.9);
  });
});
