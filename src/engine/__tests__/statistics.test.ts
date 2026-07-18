import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../rebirth';

describe('statistics initialization', () => {
  it('stats start at zero', () => {
    const state = createInitialGameState();
    expect(state.player.stats.totalCoinsEarned).toBe(0);
    expect(state.player.stats.timePlayedMs).toBe(0);
    expect(state.player.stats.totalTownBuildingsPurchased).toBe(0);
  });
});
