import { GameState, Requirement } from './types';
import { JOB_REQUIREMENTS, SKILL_REQUIREMENTS, ITEM_REQUIREMENTS } from './data/requirements';
import { JOB_MAP } from './data/jobs';
import { SKILL_MAP } from './data/skills';

export function checkRequirement(state: GameState, req: Requirement): boolean {
  switch (req.type) {
    case 'taskLevel': {
      const task = state.jobs[req.taskId] ?? state.skills[req.taskId];
      return task ? task.level >= req.level : false;
    }
    case 'coins': return state.player.coins >= req.amount;
    case 'age': return daysToYears(state.player.age) >= req.years;
    case 'evil': return state.player.evil >= req.amount;
    default: return false;
  }
}

export function checkRequirements(state: GameState, reqs: Requirement[]): boolean {
  return reqs.every(req => checkRequirement(state, req));
}

export function daysToYears(days: number): number {
  return Math.floor(days / 365);
}

export function isJobUnlocked(state: GameState, jobId: string): boolean {
  const reqs = JOB_REQUIREMENTS[jobId];
  if (!reqs) return true;
  return checkRequirements(state, reqs);
}

export function isSkillUnlocked(state: GameState, skillId: string): boolean {
  const reqs = SKILL_REQUIREMENTS[skillId];
  if (!reqs) return true;
  return checkRequirements(state, reqs);
}

export function isItemUnlocked(state: GameState, itemId: string): boolean {
  const reqs = ITEM_REQUIREMENTS[itemId];
  if (!reqs) return true;
  return checkRequirements(state, reqs);
}

export function anyRequirementMet(state: GameState, reqs: Requirement[]): boolean {
  return reqs.some(req => checkRequirement(state, req));
}

export function getRequirementDescription(state: GameState, req: Requirement): string {
  switch (req.type) {
    case 'taskLevel': {
      const name = JOB_MAP[req.taskId]?.name ?? SKILL_MAP[req.taskId]?.name ?? req.taskId;
      const task = state.jobs[req.taskId] ?? state.skills[req.taskId];
      return `${name}: ${task?.level ?? 0}/${req.level}`;
    }
    case 'coins': return `${req.amount} coins`;
    case 'age': return `Age ${req.years}`;
    case 'evil': return `Evil ${req.amount}`;
  }
}
