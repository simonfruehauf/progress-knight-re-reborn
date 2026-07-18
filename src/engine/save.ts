import { GameState } from './types';
import { createInitialGameState } from './rebirth';
import { JOB_MAP } from './data/jobs';
import { SKILL_MAP } from './data/skills';
import { ITEM_MAP } from './data/items';
import { TOWN_BUILDING_MAP } from './data/townBuildings';

const STORAGE_KEY = 'gameDataSave';

function findIdByName(name: string, map: Record<string, { name: string }>): string | null {
  for (const [id, def] of Object.entries(map)) {
    if (def.name === name) return id;
  }
  return null;
}

function migrateLegacySave(raw: any): GameState {
  const state = createInitialGameState();

  state.player.coins = raw.coins ?? state.player.coins;
  state.player.age = raw.days ?? state.player.age;
  state.player.evil = raw.evil ?? state.player.evil;
  state.player.paused = raw.paused ?? state.player.paused;
  state.player.timeWarp = raw.timeWarpingEnabled ?? state.player.timeWarp;
  state.player.rebirthOneCount = raw.rebirthOneCount ?? state.player.rebirthOneCount;
  state.player.rebirthTwoCount = raw.rebirthTwoCount ?? state.player.rebirthTwoCount;

  if (raw.currentJob?.name) {
    const id = findIdByName(raw.currentJob.name, JOB_MAP);
    if (id) state.player.currentJobId = id;
  }
  if (raw.currentSkill?.name) {
    const id = findIdByName(raw.currentSkill.name, SKILL_MAP);
    if (id) state.player.currentSkillId = id;
  }
  if (raw.currentProperty?.name) {
    const id = findIdByName(raw.currentProperty.name, ITEM_MAP);
    if (id) state.player.currentPropertyId = id;
  }
  if (Array.isArray(raw.currentMisc)) {
    state.player.currentMiscIds = raw.currentMisc
      .map((m: any) => m?.name ? findIdByName(m.name, ITEM_MAP) : null)
      .filter((id: string | null): id is string => id !== null);
  }

  if (raw.taskData && typeof raw.taskData === 'object') {
    for (const [name, data] of Object.entries(raw.taskData)) {
      const taskData = data as { level?: number; maxLevel?: number; xp?: number };
      const jobId = findIdByName(name, JOB_MAP);
      if (jobId && state.jobs[jobId]) {
        state.jobs[jobId].level = taskData.level ?? 0;
        state.jobs[jobId].maxLevel = taskData.maxLevel ?? 0;
        state.jobs[jobId].xp = taskData.xp ?? 0;
        continue;
      }
      const skillId = findIdByName(name, SKILL_MAP);
      if (skillId && state.skills[skillId]) {
        state.skills[skillId].level = taskData.level ?? 0;
        state.skills[skillId].maxLevel = taskData.maxLevel ?? 0;
        state.skills[skillId].xp = taskData.xp ?? 0;
      }
    }
  }

  if (raw.townData && typeof raw.townData === 'object') {
    for (const [name, data] of Object.entries(raw.townData)) {
      const townData = data as { count?: number; costOfNextBuilding?: number };
      const buildingId = findIdByName(name, TOWN_BUILDING_MAP);
      if (buildingId && state.town[buildingId]) {
        state.town[buildingId].count = townData.count ?? 0;
        state.town[buildingId].costOfNext = townData.costOfNextBuilding ?? TOWN_BUILDING_MAP[buildingId].baseCost;
      }
    }
  }

  return state;
}

export function saveToStorage(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail
  }
}

export function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.saveVersion === 2) {
      return parsed as GameState;
    }
    return migrateLegacySave(parsed);
  } catch {
    return null;
  }
}

export function exportSave(state: GameState): string {
  return btoa(JSON.stringify(state));
}

export function importSave(data: string): GameState | null {
  try {
    const raw = JSON.parse(atob(data));
    if (raw.saveVersion === 2) {
      return raw as GameState;
    }
    return migrateLegacySave(raw);
  } catch {
    return null;
  }
}
