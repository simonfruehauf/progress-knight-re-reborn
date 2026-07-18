import { TownBuildingDef } from '../types';

export const TOWN_BUILDINGS: TownBuildingDef[] = [
  { id: 'woodenHut', name: 'Wooden Hut', baseCost: 100000000001, costGrowthFactor: 1.01, role: ['Housing'] },
  { id: 'farm', name: 'Farm', baseCost: 1000000000001, costGrowthFactor: 1.05, role: ['Food', 'Income', 'Prestige', 'Nobility xp'], income: 150, xpMultiplier: 1.10 },
  { id: 'grainShed', name: 'Grain Shed', baseCost: 100000000001, costGrowthFactor: 1.07, role: ['Food', 'Income Boost'], targets: ['farm'], incomeMultiplier: 1.06 },
];

export const TOWN_BUILDING_MAP: Record<string, TownBuildingDef> = {};
TOWN_BUILDINGS.forEach(b => { TOWN_BUILDING_MAP[b.id] = b; });
