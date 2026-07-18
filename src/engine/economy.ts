import { GameState } from './types';
import { ITEM_MAP } from './data/items';

const SUFFIXES = ['', 'k', 'M', 'B', 'T', 'q', 'Q', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export function formatNumber(n: number): string {
  if (n < 1000) return Math.floor(n).toString();
  if (!isFinite(n)) return '∞';
  let value = n;
  let index = 0;
  while (value >= 1000 && index < SUFFIXES.length - 1) {
    value /= 1000;
    index++;
  }
  if (index >= SUFFIXES.length - 1 && value >= 1000) {
    return value.toFixed(1) + SUFFIXES[SUFFIXES.length - 1];
  }
  return value.toFixed(1) + SUFFIXES[index];
}

export interface CoinTier { label: string; value: number; color: string; }

export function formatCoins(coins: number): CoinTier[] {
  const p = Math.floor(coins / 1_000_000);
  const g = Math.floor((coins % 1_000_000) / 10_000);
  const s = Math.floor((coins % 10_000) / 100);
  const c = Math.floor(coins % 100);

  const tiers: CoinTier[] = [];
  if (p > 0) tiers.push({ label: 'p', value: p, color: '#79b9c7' });
  if (g > 0) tiers.push({ label: 'g', value: g, color: '#E5C100' });
  if (s > 0) tiers.push({ label: 's', value: s, color: '#a8a8a8' });
  if (c > 0 || tiers.length === 0) tiers.push({ label: 'c', value: c, color: '#a15c2f' });

  return tiers;
}

export function getPropertyExpense(state: GameState): number {
  const item = ITEM_MAP[state.player.currentPropertyId];
  return item ? item.expense : 0;
}

export function getMiscExpenses(state: GameState): number {
  return state.player.currentMiscIds.reduce((sum, id) => {
    const item = ITEM_MAP[id];
    return sum + (item ? item.expense : 0);
  }, 0);
}

export function getTotalExpense(state: GameState): number {
  return getPropertyExpense(state) + getMiscExpenses(state);
}
