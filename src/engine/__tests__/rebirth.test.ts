import { describe, it, expect } from 'vitest';
import { createInitialGameState, performRebirthOne, performRebirthTwo } from '../rebirth';
import { GameState } from '../types';

describe('createInitialGameState', () => {
  it('sets saveVersion to 2', () => {
    const state = createInitialGameState();
    expect(state.saveVersion).toBe(2);
  });

  it('starts at age 14', () => {
    const state = createInitialGameState();
    expect(state.player.age).toBe(365 * 14);
  });

  it('starts as beggar', () => {
    const state = createInitialGameState();
    expect(state.player.currentJobId).toBe('beggar');
  });

  it('creates all jobs and skills at level 0', () => {
    const state = createInitialGameState();
    const jobCount = Object.keys(state.jobs).length;
    const skillCount = Object.keys(state.skills).length;
    expect(jobCount).toBeGreaterThan(0);
    expect(skillCount).toBeGreaterThan(0);
    expect(Object.values(state.jobs).every(j => j.level === 0)).toBe(true);
    expect(Object.values(state.skills).every(s => s.level === 0)).toBe(true);
  });
});

describe('performRebirthOne', () => {
  it('resets level to 0 and preserves maxLevel', () => {
    const state = createInitialGameState();
    state.jobs['beggar'].level = 50;
    state.jobs['beggar'].maxLevel = 30;
    const result = performRebirthOne(state);
    expect(result.jobs['beggar'].level).toBe(0);
    expect(result.jobs['beggar'].maxLevel).toBe(50);
  });

  it('resets age to 14 years', () => {
    const state = createInitialGameState();
    state.player.age = 365 * 70;
    const result = performRebirthOne(state);
    expect(result.player.age).toBe(365 * 14);
  });

  it('resets coins to 0', () => {
    const state = createInitialGameState();
    state.player.coins = 99999;
    const result = performRebirthOne(state);
    expect(result.player.coins).toBe(0);
  });

  it('increments rebirthOneCount', () => {
    const state = createInitialGameState();
    const result = performRebirthOne(state);
    expect(result.player.rebirthOneCount).toBe(1);
  });
});

describe('performRebirthTwo', () => {
  it('increments rebirthTwoCount', () => {
    const state = createInitialGameState();
    const result = performRebirthTwo(state);
    expect(result.player.rebirthTwoCount).toBe(1);
  });

  it('resets maxLevel for all jobs and skills', () => {
    const state = createInitialGameState();
    state.jobs['beggar'].level = 50;
    state.jobs['beggar'].maxLevel = 50;
    const result = performRebirthTwo(state);
    expect(result.jobs['beggar'].maxLevel).toBe(0);
  });

  it('resets town buildings', () => {
    const state = createInitialGameState();
    state.town['woodenHut'].count = 10;
    const result = performRebirthTwo(state);
    expect(result.town['woodenHut'].count).toBe(0);
  });
});
