import { GameState, TaskState, TownBuildingState } from './types';
import { JOBS } from './data/jobs';
import { SKILLS } from './data/skills';
import { TOWN_BUILDING_MAP } from './data/townBuildings';
import { getEvilGain } from './game';

export function createInitialTaskState(): TaskState {
  return { level: 0, maxLevel: 0, xp: 0 };
}

export function createInitialGameState(): GameState {
  const jobs: Record<string, TaskState> = {};
  for (const job of JOBS) {
    jobs[job.id] = createInitialTaskState();
  }
  const skills: Record<string, TaskState> = {};
  for (const skill of SKILLS) {
    skills[skill.id] = createInitialTaskState();
  }
  const town: Record<string, TownBuildingState> = {
    woodenHut: { count: 0, costOfNext: TOWN_BUILDING_MAP['woodenHut'].baseCost },
    farm: { count: 0, costOfNext: TOWN_BUILDING_MAP['farm'].baseCost },
    grainShed: { count: 0, costOfNext: TOWN_BUILDING_MAP['grainShed'].baseCost },
  };
  return {
    saveVersion: 2,
    player: {
      age: 365 * 14,
      day: 0,
      lifespan: 365 * 70,
      coins: 0,
      evil: 0,
      currentJobId: 'beggar',
      currentSkillId: 'concentration',
      currentPropertyId: 'homeless',
      currentMiscIds: [],
      paused: false,
      autoPromote: false,
      autoLearn: false,
      timeWarp: true,
      rebirthOneCount: 0,
      rebirthTwoCount: 0,
    },
    jobs,
    skills,
    town,
  };
}

export function performRebirthOne(state: GameState): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  newState.player.rebirthOneCount += 1;
  for (const job of Object.values(newState.jobs)) {
    if (job.level > job.maxLevel) {
      job.maxLevel = job.level;
    }
    job.level = 0;
    job.xp = 0;
  }
  for (const skill of Object.values(newState.skills)) {
    if (skill.level > skill.maxLevel) {
      skill.maxLevel = skill.level;
    }
    skill.level = 0;
    skill.xp = 0;
  }
  newState.player.coins = 0;
  newState.player.age = 365 * 14;
  newState.player.day = 0;
  newState.player.currentJobId = 'beggar';
  newState.player.currentSkillId = 'concentration';
  newState.player.currentPropertyId = 'homeless';
  newState.player.currentMiscIds = [];
  return newState;
}

export function performRebirthTwo(state: GameState): GameState {
  const newState = performRebirthOne(state);
  newState.player.rebirthTwoCount += 1;
  newState.player.evil += getEvilGain(state);
  for (const job of Object.values(newState.jobs)) {
    job.maxLevel = 0;
  }
  for (const skill of Object.values(newState.skills)) {
    skill.maxLevel = 0;
  }
  for (const buildingId of Object.keys(newState.town)) {
    const def = TOWN_BUILDING_MAP[buildingId];
    if (def) {
      newState.town[buildingId] = { count: 0, costOfNext: def.baseCost };
    }
  }
  return newState;
}
