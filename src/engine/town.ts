import { GameState } from './types';
import { TOWN_BUILDING_MAP } from './data/townBuildings';

export function calculateTownIncome(state: GameState): number {
  let total = 0;

  for (const [id, bs] of Object.entries(state.town)) {
    const def = TOWN_BUILDING_MAP[id];
    if (!def || !def.income) continue;

    let income = def.income * bs.count;

    if (def.id === 'farm') {
      const grainShed = state.town['grainShed'];
      if (grainShed) {
        const gsDef = TOWN_BUILDING_MAP['grainShed'];
        const multiplier = gsDef?.incomeMultiplier ?? 1;
        income *= Math.pow(multiplier, grainShed.count);
      }
    }

    total += income;
  }

  return Math.min(total, 1_000_000_000);
}
