import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../rebirth';
import { checkAchievements, computeAchievementBonuses } from '../achievements';

describe('checkAchievements', () => {
  it('returns empty for fresh state', () => {
    const state = createInitialGameState();
    const earned = checkAchievements(state);
    expect(earned).toEqual([]);
  });

  it('detects firstSteps when beggar level >= 5', () => {
    const state = createInitialGameState();
    state.jobs['beggar'].level = 5;
    const earned = checkAchievements(state);
    expect(earned).toContain('firstSteps');
  });

  it('does not return already-earned achievements', () => {
    const state = createInitialGameState();
    state.jobs['beggar'].level = 5;
    state.player.achievements['firstSteps'] = Date.now();
    const earned = checkAchievements(state);
    expect(earned).not.toContain('firstSteps');
  });

  it('detects propertyOwner when not homeless', () => {
    const state = createInitialGameState();
    state.player.currentPropertyId = 'tent';
    const earned = checkAchievements(state);
    expect(earned).toContain('propertyOwner');
  });
});

describe('computeAchievementBonuses', () => {
  it('returns 1x for all with no achievements', () => {
    const state = createInitialGameState();
    const bonuses = computeAchievementBonuses(state);
    expect(bonuses.xpMultiplier).toBe(1);
    expect(bonuses.incomeMultiplier).toBe(1);
  });

  it('accumulates bonuses from earned achievements', () => {
    const state = createInitialGameState();
    state.player.achievements['firstSteps'] = Date.now();
    state.player.achievements['propertyOwner'] = Date.now();
    const bonuses = computeAchievementBonuses(state);
    expect(bonuses.xpMultiplier).toBe(1.005);
    expect(bonuses.happinessMultiplier).toBe(1.01);
    expect(bonuses.incomeMultiplier).toBe(1);
  });
});
