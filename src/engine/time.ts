import { GameState } from './types';

export function getBaseLog(base: number, x: number): number {
  if (x <= 0) return 0;
  return Math.log(x) / Math.log(base);
}

export function getTimeWarpingEffect(state: GameState): number {
  return 1 + getBaseLog(13, (state.skills['timeWarping']?.level ?? 0) + 1);
}

export function getFlowEffect(state: GameState): number {
  return 1 + getBaseLog(100, (state.skills['flow']?.level ?? 0) + 1) / 1.3;
}

export function getAllTimeMultipliers(state: GameState): number {
  return getFlowEffect(state) * (state.player.timeWarp ? getTimeWarpingEffect(state) : 1);
}

export function getGameSpeed(state: GameState): number {
  if (state.player.paused) return 0;
  if (state.player.age >= state.player.lifespan) return 0;
  return 4 * getAllTimeMultipliers(state);
}

export function getMaxXp(baseMaxXp: number, level: number): number {
  return Math.round(baseMaxXp * (level + 1) * Math.pow(1.01, level));
}

export function getBargainingEffect(state: GameState): number {
  return Math.max(0.1, 1 - getBaseLog(7, (state.skills['bargaining']?.level ?? 0) + 1) / 10);
}

export function getIntimidationEffect(state: GameState): number {
  return Math.max(0.1, 1 - getBaseLog(7, (state.skills['intimidation']?.level ?? 0) + 1) / 10);
}

export function getImmortalityEffect(state: GameState): number {
  return 1 + getBaseLog(33, (state.skills['immortality']?.level ?? 0) + 1);
}

export function getSuperImmortalityEffect(state: GameState): number {
  const level = state.skills['superImmortality']?.level ?? 0;
  if (level === 0) return 1;
  return 1 + getBaseLog(33, level + 1);
}
