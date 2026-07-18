import { TownBuildingDef } from '../types';

export const TOWN_BUILDINGS: TownBuildingDef[] = [
  { id: 'woodenHut', name: 'Wooden Hut', baseCost: 100000000001, costGrowthFactor: 1.01, role: ['Housing'], description: 'A humble dwelling that provides the basic requirements of nature. Rough wooden logs join together in support of brown thatched roofing, providing a cozy retreat from rain and wind.' },
  { id: 'farm', name: 'Farm', baseCost: 1000000000001, costGrowthFactor: 1.05, role: ['Food', 'Income', 'Prestige', 'Nobility xp'], income: 150, xpMultiplier: 1.10, description: 'Rocks abound within these sour patches of inhospitable soil you and your people call \'farms\'. Healing the soil is a monumental undertaking.' },
  { id: 'grainShed', name: 'Grain Shed', baseCost: 100000000001, costGrowthFactor: 1.07, role: ['Food', 'Income Boost'], targets: ['farm'], incomeMultiplier: 1.06, description: 'A savvy merchant knows the dynamics of supply and demand. Your grain sheds allow your townsfolk to hold off selling until prices rise.' },
  { id: 'secret', name: 'Secret', baseCost: 0, costGrowthFactor: 1, role: [], description: 'Soon!' },
];

export const TOWN_BUILDING_MAP: Record<string, TownBuildingDef> = {};
TOWN_BUILDINGS.forEach(b => { TOWN_BUILDING_MAP[b.id] = b; });
