import { ItemDef } from '../types';

export const ITEMS: ItemDef[] = [
  { id: 'homeless', name: 'Homeless', category: 'Property', expense: 0, effect: 1 },
  { id: 'tent', name: 'Tent', category: 'Property', expense: 15, effect: 1.4 },
  { id: 'woodenHut', name: 'Wooden hut', category: 'Property', expense: 100, effect: 2 },
  { id: 'cottage', name: 'Cottage', category: 'Property', expense: 750, effect: 3.5 },
  { id: 'house', name: 'House', category: 'Property', expense: 3000, effect: 6 },
  { id: 'largeHouse', name: 'Large house', category: 'Property', expense: 25000, effect: 12 },
  { id: 'smallManor', name: 'Small Manor', category: 'Property', expense: 300000, effect: 25 },
  { id: 'smallPalace', name: 'Small palace', category: 'Property', expense: 5000000, effect: 60 },
  { id: 'grandPalace', name: 'Grand palace', category: 'Property', expense: 190000000, effect: 135 },

  { id: 'ragClothing', name: 'Rag Clothing', category: 'Misc', expense: 3, effect: 1.5, description: 'Skill xp' },
  { id: 'book', name: 'Book', category: 'Misc', expense: 10, effect: 1.5, description: 'Skill xp' },
  { id: 'basicFarmTools', name: 'Basic Farm Tools', category: 'Misc', expense: 10, effect: 1.5, description: 'Farm upgrade' },
  { id: 'dumbbells', name: 'Dumbbells', category: 'Misc', expense: 50, effect: 1.5, description: 'Strength xp' },
  { id: 'personalSquire', name: 'Personal squire', category: 'Misc', expense: 200, effect: 2, description: 'Job xp' },
  { id: 'steelLongsword', name: 'Steel longsword', category: 'Misc', expense: 1000, effect: 2, description: 'Military xp' },
  { id: 'butler', name: 'Butler', category: 'Misc', expense: 7500, effect: 1.5, description: 'Happiness' },
  { id: 'sapphireCharm', name: 'Sapphire charm', category: 'Misc', expense: 50000, effect: 3, description: 'Magic xp' },
  { id: 'studyDesk', name: 'Study desk', category: 'Misc', expense: 1000000, effect: 2, description: 'Skill xp' },
  { id: 'library', name: 'Library', category: 'Misc', expense: 12000000, effect: 1.5, description: 'Skill xp' },
  { id: 'smallField', name: 'Small Field', category: 'Misc', expense: 130, effect: 5.0, description: 'Farm upgrade' },
  { id: 'oxDrivenPlow', name: 'Ox-driven Plow', category: 'Misc', expense: 200, effect: 2.4, description: 'Farm upgrade' },
  { id: 'livestockDerivedFertilizer', name: 'Livestock-derived Fertilizer', category: 'Misc', expense: 20, effect: 1.2, description: 'Farm upgrade' },
  { id: 'cheapFishingRod', name: 'Cheap Fishing Rod', category: 'Misc', expense: 20, effect: 2.0, description: 'Fishing upgrade' },
  { id: 'minersLantern', name: "Miner's Lantern", category: 'Misc', expense: 35, effect: 1.5, description: 'Mining upgrade' },
  { id: 'crappyAnvil', name: 'Crappy Anvil', category: 'Misc', expense: 50, effect: 1.5, description: 'Blacksmith upgrade' },
  { id: 'breechBellows', name: 'Breech Bellows', category: 'Misc', expense: 130, effect: 1.8, description: 'Blacksmith upgrade' },
  { id: 'packHorse', name: 'Pack Horse', category: 'Misc', expense: 80, effect: 3.0, description: 'Merchant upgrade' },
  { id: 'smallShop', name: 'Small Shop', category: 'Misc', expense: 600, effect: 1.5, description: 'Merchant upgrade' },
  { id: 'weaponOutlet', name: 'Weapon Outlet', category: 'Misc', expense: 3000, effect: 3.0, description: 'Merchant upgrade' },
];

export const ITEM_MAP: Record<string, ItemDef> = {};
ITEMS.forEach(i => { ITEM_MAP[i.id] = i; });
