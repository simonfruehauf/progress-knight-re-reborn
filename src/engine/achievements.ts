import { GameState } from './types';
import { ACHIEVEMENTS } from './data/achievements';

export function checkAchievements(state: GameState): string[] {
  const newlyEarned: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (state.player.achievements[ach.id]) continue;
    if (ach.check(state)) {
      newlyEarned.push(ach.id);
    }
  }
  return newlyEarned;
}

export function computeAchievementBonuses(state: GameState): Record<string, number> {
  const bonuses: Record<string, number> = {
    xpMultiplier: 1,
    incomeMultiplier: 1,
    happinessMultiplier: 1,
    evilMultiplier: 1,
  };
  for (const [achId, timestamp] of Object.entries(state.player.achievements)) {
    if (!timestamp) continue;
    const ach = ACHIEVEMENTS.find((a) => a.id === achId);
    if (ach) {
      const key = ach.bonus.type;
      bonuses[key] += ach.bonus.value;
    }
  }
  return bonuses;
}
