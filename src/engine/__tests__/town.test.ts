import { describe, it, expect } from 'vitest';
import { calculateTownIncome } from '../town';
import { createInitialGameState } from '../rebirth';

describe('calculateTownIncome', () => {
  it('returns 0 with no buildings', () => {
    const state = createInitialGameState();
    expect(calculateTownIncome(state)).toBe(0);
  });

  it('returns farm income when farm has count', () => {
    const state = createInitialGameState();
    state.town['farm'].count = 1;
    const income = calculateTownIncome(state);
    expect(income).toBeGreaterThan(0);
  });

  it('caps at 1_000_000_000', () => {
    const state = createInitialGameState();
    state.town['farm'].count = 99999999;
    const income = calculateTownIncome(state);
    expect(income).toBeLessThanOrEqual(1_000_000_000);
  });
});
