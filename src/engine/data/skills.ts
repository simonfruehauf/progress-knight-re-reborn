import { SkillDef } from '../types';

const baseEffect = 0.01;

export const SKILLS: SkillDef[] = [
  { id: 'concentration', name: 'Concentration', maxXp: 100, effect: baseEffect, description: 'Skill xp', category: 'Fundamentals' },
  { id: 'productivity', name: 'Productivity', maxXp: 100, effect: 0.01, description: 'Job xp', category: 'Fundamentals' },
  { id: 'bargaining', name: 'Bargaining', maxXp: 100, effect: -0.01, description: 'Expenses', category: 'Fundamentals' },
  { id: 'meditation', name: 'Meditation', maxXp: 100, effect: baseEffect, description: 'Happiness', category: 'Fundamentals' },

  { id: 'strength', name: 'Strength', maxXp: 100, effect: 0.01, description: 'Military pay', category: 'Combat' },
  { id: 'battleTactics', name: 'Battle tactics', maxXp: 100, effect: 0.01, description: 'Military xp', category: 'Combat' },
  { id: 'muscleMemory', name: 'Muscle memory', maxXp: 100, effect: 0.01, description: 'Strength xp', category: 'Combat' },

  { id: 'manaControl', name: 'Mana control', maxXp: 100, effect: baseEffect, description: 'T.A.A. xp', category: 'Magic' },
  { id: 'immortality', name: 'Immortality', maxXp: 100, effect: 0.01, description: 'Longer lifespan', category: 'Magic' },
  { id: 'timeWarping', name: 'Time warping', maxXp: 100, effect: 0.01, description: 'Gamespeed', category: 'Magic' },
  { id: 'superImmortality', name: 'Super immortality', maxXp: 100, effect: 0.01, description: 'Longer lifespan', category: 'Magic' },

  { id: 'novelKnowledge', name: 'Novel Knowledge', maxXp: 100, effect: 0.01, description: 'Discovery xp', category: 'Mind' },
  { id: 'unusualInsight', name: 'Unusual Insight', maxXp: 100, effect: 0.005, description: 'Magical xp', category: 'Mind' },
  { id: 'tradePsychology', name: 'Trade Psychology', maxXp: 100, effect: 0.80, description: 'Merchant pay', category: 'Mind' },
  { id: 'flow', name: 'Flow', maxXp: 800, effect: 0.001, description: 'Gamespeed', category: 'Mind' },
  { id: 'magicalEngineering', name: 'Magical Engineering', maxXp: 1000, effect: 0.01, description: 'Chairman xp', category: 'Mind' },
  { id: 'scalesOfThought', name: 'Scales Of Thought', maxXp: 1100, effect: 0.003, description: 'Magical xp', category: 'Mind' },
  { id: 'magicalBiology', name: 'Magical Biology', maxXp: 1500, effect: 0.005, description: 'Chairman xp', category: 'Mind' },

  { id: 'darkInfluence', name: 'Dark influence', maxXp: 100, effect: 0.01, description: 'All xp', category: 'Dark Magic' },
  { id: 'evilControl', name: 'Evil control', maxXp: 100, effect: 0.01, description: 'Evil gain', category: 'Dark Magic' },
  { id: 'intimidation', name: 'Intimidation', maxXp: 100, effect: -0.01, description: 'Expenses', category: 'Dark Magic' },
  { id: 'demonTraining', name: 'Demon training', maxXp: 100, effect: 0.01, description: 'All xp', category: 'Dark Magic' },
  { id: 'bloodMeditation', name: 'Blood meditation', maxXp: 100, effect: 0.01, description: 'Evil gain', category: 'Dark Magic' },
  { id: 'demonsWealth', name: "Demon's wealth", maxXp: 100, effect: 0.002, description: 'Job pay', category: 'Dark Magic' },
];

export const SKILL_MAP: Record<string, SkillDef> = {};
SKILLS.forEach(s => { SKILL_MAP[s.id] = s; });
