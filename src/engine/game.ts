import { GameState } from './types';
import { JOBS, JOB_MAP } from './data/jobs';
import { SKILL_MAP } from './data/skills';
import { ITEM_MAP } from './data/items';
import {
  getGameSpeed, getMaxXp, getBargainingEffect, getIntimidationEffect,
  getImmortalityEffect, getSuperImmortalityEffect,
  getBaseLog,
} from './time';
import { calculateTownIncome } from './town';
import { getTotalExpense } from './economy';
import { isJobUnlocked, isSkillUnlocked } from './requirements';
import { checkAchievements, computeAchievementBonuses } from './achievements';

const UPDATE_SPEED = 20;
const BASE_LIFESPAN = 365 * 70;

function applySpeed(value: number, state: GameState): number {
  return value * getGameSpeed(state) / UPDATE_SPEED;
}

export function getHappiness(state: GameState): number {
  const meditation = state.skills['meditation'];
  const meditationEffect = 1 + (meditation?.level ?? 0) * SKILL_MAP['meditation'].effect;
  const butlerEffect = state.player.currentMiscIds.includes('butler') ? ITEM_MAP['butler'].effect : 1;
  const propertyEffect = ITEM_MAP[state.player.currentPropertyId]?.effect ?? 1;
  return meditationEffect * butlerEffect * propertyEffect;
}

export function getEvilGain(state: GameState): number {
  const evilControl = state.skills['evilControl'];
  const bloodMeditation = state.skills['bloodMeditation'];
  const ecEffect = 1 + (evilControl?.level ?? 0) * SKILL_MAP['evilControl'].effect;
  const bmEffect = 1 + (bloodMeditation?.level ?? 0) * SKILL_MAP['bloodMeditation'].effect;
  return ecEffect * bmEffect;
}

export function getJobXpGain(state: GameState, jobId: string): number {
  const job = state.jobs[jobId];
  const jobDef = JOB_MAP[jobId];
  let mult = 1;

  mult *= 1 + (job?.maxLevel ?? 0) * 0.1;
  mult *= getHappiness(state);

  const darkInfluence = state.skills['darkInfluence'];
  mult *= 1 + (darkInfluence?.level ?? 0) * SKILL_MAP['darkInfluence'].effect;

  const demonTraining = state.skills['demonTraining'];
  mult *= 1 + (demonTraining?.level ?? 0) * SKILL_MAP['demonTraining'].effect;

  const productivity = state.skills['productivity'];
  mult *= 1 + (productivity?.level ?? 0) * SKILL_MAP['productivity'].effect;

  if (state.player.currentMiscIds.includes('personalSquire')) {
    mult *= ITEM_MAP['personalSquire'].effect;
  }

  if (jobDef.category === 'Military') {
    const battleTactics = state.skills['battleTactics'];
    mult *= 1 + (battleTactics?.level ?? 0) * SKILL_MAP['battleTactics'].effect;
    if (state.player.currentMiscIds.includes('steelLongsword')) {
      mult *= ITEM_MAP['steelLongsword'].effect;
    }
  }
  if (jobDef.category === 'The Arcane Association') {
    const manaControl = state.skills['manaControl'];
    mult *= 1 + (manaControl?.level ?? 0) * SKILL_MAP['manaControl'].effect;
    const novelKnowledge = state.skills['novelKnowledge'];
    mult *= 1 + (novelKnowledge?.level ?? 0) * SKILL_MAP['novelKnowledge'].effect;
    const unusualInsight = state.skills['unusualInsight'];
    mult *= 1 + (unusualInsight?.level ?? 0) * SKILL_MAP['unusualInsight'].effect;
  }
  if (jobDef.category === 'The Order of Discovery') {
    const novelKnowledge = state.skills['novelKnowledge'];
    mult *= 1 + (novelKnowledge?.level ?? 0) * SKILL_MAP['novelKnowledge'].effect;
    const unusualInsight = state.skills['unusualInsight'];
    mult *= 1 + (unusualInsight?.level ?? 0) * SKILL_MAP['unusualInsight'].effect;
  }

  if (jobId === 'farmer') {
    if (state.player.currentMiscIds.includes('smallField')) {
      mult *= ITEM_MAP['smallField'].effect;
    }
    if (state.player.currentMiscIds.includes('oxDrivenPlow')) {
      mult *= ITEM_MAP['oxDrivenPlow'].effect;
    }
  }
  if (jobId === 'fisherman' && state.player.currentMiscIds.includes('cheapFishingRod')) {
    mult *= ITEM_MAP['cheapFishingRod'].effect;
  }
  if (jobId === 'miner' && state.player.currentMiscIds.includes('minersLantern')) {
    mult *= ITEM_MAP['minersLantern'].effect;
  }
  if (jobId === 'blacksmith') {
    if (state.player.currentMiscIds.includes('crappyAnvil')) {
      mult *= ITEM_MAP['crappyAnvil'].effect;
    }
    if (state.player.currentMiscIds.includes('breechBellows')) {
      mult *= ITEM_MAP['breechBellows'].effect;
    }
  }
  if (jobId === 'chairman' || jobId === 'illustriousChairman') {
    const magicalEngineering = state.skills['magicalEngineering'];
    mult *= 1 + (magicalEngineering?.level ?? 0) * SKILL_MAP['magicalEngineering'].effect;
    const scalesOfThought = state.skills['scalesOfThought'];
    mult *= 1 + (scalesOfThought?.level ?? 0) * SKILL_MAP['scalesOfThought'].effect;
    const magicalBiology = state.skills['magicalBiology'];
    mult *= 1 + (magicalBiology?.level ?? 0) * SKILL_MAP['magicalBiology'].effect;
  }

  return 10 * mult;
}

export function getSkillXpGain(state: GameState, skillId: string): number {
  const skill = state.skills[skillId];
  const skillDef = SKILL_MAP[skillId];
  let mult = 1;

  mult *= 1 + (skill?.maxLevel ?? 0) * 0.1;
  mult *= getHappiness(state);

  const darkInfluence = state.skills['darkInfluence'];
  mult *= 1 + (darkInfluence?.level ?? 0) * SKILL_MAP['darkInfluence'].effect;

  const demonTraining = state.skills['demonTraining'];
  mult *= 1 + (demonTraining?.level ?? 0) * SKILL_MAP['demonTraining'].effect;

  const concentration = state.skills['concentration'];
  mult *= 1 + (concentration?.level ?? 0) * SKILL_MAP['concentration'].effect;

  if (state.player.currentMiscIds.includes('ragClothing')) {
    mult *= ITEM_MAP['ragClothing'].effect;
  }
  if (state.player.currentMiscIds.includes('book')) {
    mult *= ITEM_MAP['book'].effect;
  }
  if (state.player.currentMiscIds.includes('studyDesk')) {
    mult *= ITEM_MAP['studyDesk'].effect;
  }
  if (state.player.currentMiscIds.includes('library')) {
    mult *= ITEM_MAP['library'].effect;
  }

  if (skillId === 'strength') {
    const muscleMemory = state.skills['muscleMemory'];
    mult *= 1 + (muscleMemory?.level ?? 0) * SKILL_MAP['muscleMemory'].effect;
    if (state.player.currentMiscIds.includes('dumbbells')) {
      mult *= ITEM_MAP['dumbbells'].effect;
    }
  }
  if (skillDef.category === 'Magic') {
    if (state.player.currentMiscIds.includes('sapphireCharm')) {
      mult *= ITEM_MAP['sapphireCharm'].effect;
    }
    const novelKnowledge = state.skills['novelKnowledge'];
    mult *= 1 + (novelKnowledge?.level ?? 0) * SKILL_MAP['novelKnowledge'].effect;
    const unusualInsight = state.skills['unusualInsight'];
    mult *= 1 + (unusualInsight?.level ?? 0) * SKILL_MAP['unusualInsight'].effect;
    const scalesOfThought = state.skills['scalesOfThought'];
    mult *= 1 + (scalesOfThought?.level ?? 0) * SKILL_MAP['scalesOfThought'].effect;
  }
  if (skillDef.category === 'Dark Magic') {
    mult *= Math.max(1, state.player.evil);
  }

  return 10 * mult;
}

export function getJobIncome(state: GameState, jobId: string): number {
  const jobDef = JOB_MAP[jobId];
  const job = state.jobs[jobId];
  let mult = 1;

  mult *= 1 + getBaseLog(10, (job?.level ?? 0) + 1);

  const demonsWealth = state.skills['demonsWealth'];
  mult *= 1 + (demonsWealth?.level ?? 0) * SKILL_MAP['demonsWealth'].effect;

  if (jobDef.category === 'Military') {
    const strength = state.skills['strength'];
    mult *= 1 + (strength?.level ?? 0) * SKILL_MAP['strength'].effect;
  }

  if (jobId === 'merchant') {
    const tradePsychology = state.skills['tradePsychology'];
    mult *= 1 + (tradePsychology?.level ?? 0) * SKILL_MAP['tradePsychology'].effect;
    if (state.player.currentMiscIds.includes('packHorse')) {
      mult *= ITEM_MAP['packHorse'].effect;
    }
    if (state.player.currentMiscIds.includes('smallShop')) {
      mult *= ITEM_MAP['smallShop'].effect;
    }
    if (state.player.currentMiscIds.includes('weaponOutlet')) {
      mult *= ITEM_MAP['weaponOutlet'].effect;
    }
  }
  if (jobId === 'farmer') {
    if (state.player.currentMiscIds.includes('basicFarmTools')) {
      mult *= ITEM_MAP['basicFarmTools'].effect;
    }
    if (state.player.currentMiscIds.includes('smallField')) {
      mult *= ITEM_MAP['smallField'].effect;
    }
    if (state.player.currentMiscIds.includes('oxDrivenPlow')) {
      mult *= ITEM_MAP['oxDrivenPlow'].effect;
    }
    if (state.player.currentMiscIds.includes('livestockDerivedFertilizer')) {
      mult *= ITEM_MAP['livestockDerivedFertilizer'].effect;
    }
  }
  if (jobId === 'fisherman' && state.player.currentMiscIds.includes('cheapFishingRod')) {
    mult *= ITEM_MAP['cheapFishingRod'].effect;
  }
  if (jobId === 'miner' && state.player.currentMiscIds.includes('minersLantern')) {
    mult *= ITEM_MAP['minersLantern'].effect;
  }
  if (jobId === 'blacksmith') {
    if (state.player.currentMiscIds.includes('crappyAnvil')) {
      mult *= ITEM_MAP['crappyAnvil'].effect;
    }
    if (state.player.currentMiscIds.includes('breechBellows')) {
      mult *= ITEM_MAP['breechBellows'].effect;
    }
  }
  if (jobId === 'chairman' || jobId === 'illustriousChairman') {
    const magicalEngineering = state.skills['magicalEngineering'];
    mult *= 1 + (magicalEngineering?.level ?? 0) * SKILL_MAP['magicalEngineering'].effect;
  }

  return jobDef.income * mult;
}

export function increaseDays(state: GameState): GameState {
  const newState = structuredClone(state);
  const ageIncrease = applySpeed(1, newState);
  newState.player.age += ageIncrease;
  newState.player.day = Math.floor(newState.player.age % 365);
  newState.player.lifespan = BASE_LIFESPAN * getImmortalityEffect(newState) * getSuperImmortalityEffect(newState);
  return newState;
}

export function gameTick(state: GameState): GameState {
  const newState = increaseDays(state);

  if (newState.player.autoPromote && newState.player.currentJobId !== null) {
    const currentJobDef = JOB_MAP[newState.player.currentJobId];
    if (currentJobDef) {
      const categoryJobs = JOBS.filter(j => j.category === currentJobDef.category);
      const currentIdx = categoryJobs.findIndex(j => j.id === newState.player.currentJobId);
      if (currentIdx >= 0 && currentIdx < categoryJobs.length - 1) {
        const nextJobId = categoryJobs[currentIdx + 1].id;
        if (isJobUnlocked(newState, nextJobId)) {
          newState.player.currentJobId = nextJobId;
        }
      }
    }
  }

  if (newState.player.autoLearn) {
    let bestSkillId: string | null = newState.player.currentSkillId;
    let bestRatio = Infinity;
    for (const skillId of Object.keys(SKILL_MAP)) {
      const skillState = newState.skills[skillId];
      if (!skillState) continue;
      if (!isSkillUnlocked(newState, skillId)) continue;
      if (newState.player.skippedSkills.includes(skillId)) continue;
      const xpGain = getSkillXpGain(newState, skillId);
      if (xpGain <= 0) continue;
      const maxXp = getMaxXp(SKILL_MAP[skillId].maxXp, skillState.level);
      const ratio = maxXp / xpGain;
      if (ratio < bestRatio) {
        bestRatio = ratio;
        bestSkillId = skillId;
      }
    }
    if (bestSkillId !== null) {
      newState.player.currentSkillId = bestSkillId;
    }
  }

  if (newState.player.currentJobId !== null) {
    const jobState = newState.jobs[newState.player.currentJobId];
    if (jobState) {
      const xpGain = applySpeed(getJobXpGain(newState, newState.player.currentJobId), newState);
      jobState.xp += xpGain;
      const maxXp = getMaxXp(JOB_MAP[newState.player.currentJobId].maxXp, jobState.level);
      if (jobState.xp >= maxXp) {
        jobState.level += 1;
        jobState.xp -= maxXp;
      }
    }
  }

  if (newState.player.currentSkillId !== null) {
    const skillState = newState.skills[newState.player.currentSkillId];
    if (skillState) {
      const xpGain = applySpeed(getSkillXpGain(newState, newState.player.currentSkillId), newState);
      skillState.xp += xpGain;
      const maxXp = getMaxXp(SKILL_MAP[newState.player.currentSkillId].maxXp, skillState.level);
      if (skillState.xp >= maxXp) {
        skillState.level += 1;
        skillState.xp -= maxXp;
      }
    }
  }

  let jobIncome = 0;
  if (newState.player.currentJobId !== null) {
    jobIncome = applySpeed(getJobIncome(newState, newState.player.currentJobId), newState);
  }
  const townIncome = applySpeed(calculateTownIncome(newState), newState);
  const totalIncome = jobIncome + townIncome;
  const expenses = applySpeed(
    getTotalExpense(newState) * getBargainingEffect(newState) * getIntimidationEffect(newState),
    newState
  );
  newState.player.coins += totalIncome - expenses;
  if (newState.player.coins < 0) {
    newState.player.coins = 0;
    newState.player.currentPropertyId = 'homeless';
    newState.player.currentMiscIds = [];
  }

  const newlyEarned = checkAchievements(newState);
  for (const achId of newlyEarned) {
    newState.player.achievements[achId] = Date.now();
  }
  if (newlyEarned.length > 0) {
    newState.player.achievementBonuses = computeAchievementBonuses(newState);
  }

  return newState;
}
