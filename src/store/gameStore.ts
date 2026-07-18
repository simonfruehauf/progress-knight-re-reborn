import { create } from 'zustand';
import { GameState } from '../engine/types';
import { gameTick } from '../engine/game';
import { performRebirthOne, performRebirthTwo, createInitialGameState } from '../engine/rebirth';
import { saveToStorage, loadFromStorage, exportSave, importSave } from '../engine/save';
import { TOWN_BUILDING_MAP } from '../engine/data/townBuildings';

interface GameStore extends GameState {
  tick: () => void;
  setJob: (jobId: string) => void;
  setSkill: (skillId: string) => void;
  setProperty: (propertyId: string) => void;
  toggleMisc: (miscId: string) => void;
  togglePause: () => void;
  toggleAutoPromote: () => void;
  toggleAutoLearn: () => void;
  toggleSkipSkill: (skillId: string) => void;
  toggleTimeWarp: () => void;
  purchaseTownBuilding: (buildingId: string) => void;
  doRebirthOne: () => void;
  doRebirthTwo: () => void;
  importSaveData: (data: string) => boolean;
  exportSaveData: () => string;
  resetGame: () => void;
  saveGame: () => void;
}

function getInitialState(): GameState {
  return loadFromStorage() ?? createInitialGameState();
}

export const useGameStore = create<GameStore>()((set, get) => ({
  ...getInitialState(),

  tick: () => {
    const s = get();
    if (s.player.paused || s.player.age >= s.player.lifespan) return;
    set(gameTick(s));
  },

  setJob: (jobId: string) => {
    set(s => ({ player: { ...s.player, currentJobId: jobId } }));
  },

  setSkill: (skillId: string) => {
    set(s => ({ player: { ...s.player, currentSkillId: skillId } }));
  },

  setProperty: (propertyId: string) => {
    set(s => ({ player: { ...s.player, currentPropertyId: propertyId } }));
  },

  toggleMisc: (miscId: string) => {
    set(s => {
      const has = s.player.currentMiscIds.includes(miscId);
      return {
        player: {
          ...s.player,
          currentMiscIds: has
            ? s.player.currentMiscIds.filter(id => id !== miscId)
            : [...s.player.currentMiscIds, miscId],
        },
      };
    });
  },

  togglePause: () => {
    set(s => ({ player: { ...s.player, paused: !s.player.paused } }));
  },

  toggleAutoPromote: () => {
    set(s => ({ player: { ...s.player, autoPromote: !s.player.autoPromote } }));
  },

  toggleAutoLearn: () => {
    set(s => ({ player: { ...s.player, autoLearn: !s.player.autoLearn } }));
  },
  toggleSkipSkill: (skillId: string) => {
    set(s => {
      const has = s.player.skippedSkills.includes(skillId);
      return { player: { ...s.player, skippedSkills: has ? s.player.skippedSkills.filter(id => id !== skillId) : [...s.player.skippedSkills, skillId] } };
    });
  },

  toggleTimeWarp: () => {
    set(s => ({ player: { ...s.player, timeWarp: !s.player.timeWarp } }));
  },

  purchaseTownBuilding: (buildingId: string) => {
    set(s => {
      const building = s.town[buildingId];
      if (!building || s.player.coins < building.costOfNext) return s;
      const def = TOWN_BUILDING_MAP[buildingId];
      return {
        player: { ...s.player, coins: s.player.coins - building.costOfNext },
        town: {
          ...s.town,
          [buildingId]: {
            count: building.count + 1,
            costOfNext: Math.floor(building.costOfNext * def.costGrowthFactor),
          },
        },
      };
    });
  },

  doRebirthOne: () => {
    set(s => performRebirthOne(s));
  },

  doRebirthTwo: () => {
    set(s => performRebirthTwo(s));
  },

  importSaveData: (data: string) => {
    const loaded = importSave(data);
    if (loaded) {
      set(loaded);
      saveToStorage(loaded);
      return true;
    }
    return false;
  },

  exportSaveData: () => {
    return exportSave(get());
  },

  resetGame: () => {
    const fresh = createInitialGameState();
    set(fresh);
    localStorage.removeItem('gameDataSave');
  },

  saveGame: () => {
    saveToStorage(get());
  },
}));
