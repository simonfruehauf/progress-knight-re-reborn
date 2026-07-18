export interface TaskLevelReq { type: 'taskLevel'; taskId: string; level: number; }
export interface CoinReq { type: 'coins'; amount: number; }
export interface AgeReq { type: 'age'; years: number; }
export interface EvilReq { type: 'evil'; amount: number; }
export type Requirement = TaskLevelReq | CoinReq | AgeReq | EvilReq;

export interface JobDef { id: string; name: string; maxXp: number; income: number; category: string; }
export interface SkillDef { id: string; name: string; maxXp: number; effect: number; description: string; category: string; }
export interface ItemDef { id: string; name: string; category: 'Property' | 'Misc'; expense: number; effect: number; description?: string; }
export interface TownBuildingDef { id: string; name: string; baseCost: number; costGrowthFactor: number; role: string[]; income?: number; xpMultiplier?: number; targets?: string[]; incomeMultiplier?: number; description?: string; }

export interface TaskState { level: number; maxLevel: number; xp: number; }
export interface PlayerState {
  age: number; day: number; lifespan: number; coins: number; evil: number;
  currentJobId: string | null; currentSkillId: string | null;
  currentPropertyId: string; currentMiscIds: string[];
  paused: boolean; autoPromote: boolean; autoLearn: boolean; timeWarp: boolean;
  rebirthOneCount: number; rebirthTwoCount: number;
  skippedSkills: string[];
}
export interface TownBuildingState { count: number; costOfNext: number; }
export interface GameState {
  player: PlayerState; jobs: Record<string, TaskState>; skills: Record<string, TaskState>;
  town: Record<string, TownBuildingState>; saveVersion: number;
}
