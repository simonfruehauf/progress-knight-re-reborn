import { AchievementDef } from '../types';
import { JOBS } from './jobs';
import { SKILLS } from './skills';
import { isJobUnlocked, isSkillUnlocked, daysToYears } from '../requirements';
import { getAllTimeMultipliers } from '../time';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'firstSteps',
    name: 'First Steps',
    description: 'Reach level 5 in Beggar',
    check: (s) => s.jobs['beggar'].level >= 5,
    bonus: { type: 'xpMultiplier', value: 0.005 },
  },
  {
    id: 'careerPath',
    name: 'Career Path',
    description: 'Auto-promote first time',
    check: (s) => s.player.autoPromote === true,
    bonus: { type: 'xpMultiplier', value: 0.005 },
  },
  {
    id: 'wellRead',
    name: 'Well Read',
    description: 'Buy Book item',
    check: (s) => s.player.currentMiscIds.includes('book'),
    bonus: { type: 'xpMultiplier', value: 0.005 },
  },
  {
    id: 'propertyOwner',
    name: 'Property Owner',
    description: 'Buy any property (not homeless)',
    check: (s) => s.player.currentPropertyId !== 'homeless',
    bonus: { type: 'happinessMultiplier', value: 0.01 },
  },
  {
    id: 'skillSeeker',
    name: 'Skill Seeker',
    description: 'Reach level 10 in any skill',
    check: (s) => Object.values(s.skills).some((sk) => sk.level >= 10),
    bonus: { type: 'xpMultiplier', value: 0.005 },
  },
  {
    id: 'townFounder',
    name: 'Town Founder',
    description: 'Buy first town building',
    check: (s) => Object.values(s.town).some((t) => t.count > 0),
    bonus: { type: 'incomeMultiplier', value: 0.01 },
  },
  {
    id: 'twentySomething',
    name: 'Twenty Something',
    description: 'Reach age 20',
    check: (s) => daysToYears(s.player.age) >= 20,
    bonus: { type: 'xpMultiplier', value: 0.005 },
  },
  {
    id: 'jackOfAllTrades',
    name: 'Jack of All Trades',
    description: 'Unlock all Common Work jobs',
    check: (s) => {
      const commonWorkJobs = JOBS.filter((j) => j.category === 'Common Work');
      return commonWorkJobs.every((j) => isJobUnlocked(s, j.id));
    },
    bonus: { type: 'incomeMultiplier', value: 0.01 },
  },
  {
    id: 'selfImprovement',
    name: 'Self Improvement',
    description: 'Reach level 50 in Concentration',
    check: (s) => s.skills['concentration'].level >= 50,
    bonus: { type: 'xpMultiplier', value: 0.01 },
  },
  {
    id: 'militaryMight',
    name: 'Military Might',
    description: 'Reach Knight',
    check: (s) => s.jobs['knight'].level > 0,
    bonus: { type: 'xpMultiplier', value: 0.01 },
  },
  {
    id: 'arcaneScholar',
    name: 'Arcane Scholar',
    description: 'Reach Mage',
    check: (s) => s.jobs['mage'].level > 0,
    bonus: { type: 'xpMultiplier', value: 0.01 },
  },
  {
    id: 'mindOverMatter',
    name: 'Mind Over Matter',
    description: 'Unlock all Mind skills',
    check: (s) => {
      const mindSkills = SKILLS.filter((sk) => sk.category === 'Mind');
      return mindSkills.every((sk) => isSkillUnlocked(s, sk.id));
    },
    bonus: { type: 'xpMultiplier', value: 0.015 },
  },
  {
    id: 'discovery',
    name: 'Discovery',
    description: 'Reach Senior in Order',
    check: (s) => s.jobs['senior'].level > 0,
    bonus: { type: 'incomeMultiplier', value: 0.015 },
  },
  {
    id: 'nobility',
    name: 'Nobility',
    description: 'Become Count',
    check: (s) => s.jobs['count'].level > 0,
    bonus: { type: 'xpMultiplier', value: 0.015 },
  },
  {
    id: 'chairman',
    name: 'Chairman',
    description: 'Reach Chairman',
    check: (s) => s.jobs['chairman'].level > 0,
    bonus: { type: 'xpMultiplier', value: 0.02 },
  },
  {
    id: 'illustrious',
    name: 'Illustrious',
    description: 'Reach Illustrious Chairman',
    check: (s) => s.jobs['illustriousChairman'].level > 0,
    bonus: { type: 'xpMultiplier', value: 0.025 },
  },
  {
    id: 'immortal',
    name: 'Immortal',
    description: 'Unlock Super Immortality',
    check: (s) => isSkillUnlocked(s, 'superImmortality'),
    bonus: { type: 'happinessMultiplier', value: 0.02 },
  },
  {
    id: 'rebirth',
    name: 'Rebirth',
    description: 'Perform Rebirth One',
    check: (s) => s.player.rebirthOneCount > 0,
    bonus: { type: 'xpMultiplier', value: 0.02 },
  },
  {
    id: 'touchTheEye',
    name: 'Touch the Eye',
    description: 'Reach age 65',
    check: (s) => daysToYears(s.player.age) >= 65,
    bonus: { type: 'happinessMultiplier', value: 0.015 },
  },
  {
    id: 'timeTraveler',
    name: 'Time Traveler',
    description: 'Use Time Warp',
    check: (s) => s.player.timeWarp && s.player.day > 0,
    bonus: { type: 'xpMultiplier', value: 0.01 },
  },
  {
    id: 'evilAwakening',
    name: 'Evil Awakening',
    description: 'Perform Rebirth Two',
    check: (s) => s.player.rebirthTwoCount > 0,
    bonus: { type: 'evilMultiplier', value: 0.05 },
  },
  {
    id: 'warMaster',
    name: 'War Master',
    description: 'Max all Military jobs',
    check: (s) => {
      const milJobs = JOBS.filter((j) => j.category === 'Military');
      return milJobs.every((j) => s.jobs[j.id].maxLevel >= 100);
    },
    bonus: { type: 'incomeMultiplier', value: 0.02 },
  },
  {
    id: 'masterOfMagic',
    name: 'Master of Magic',
    description: 'Max all Magic skills',
    check: (s) => {
      const magicSkills = SKILLS.filter((sk) => sk.category === 'Magic');
      return magicSkills.every((sk) => s.skills[sk.id].maxLevel >= 100);
    },
    bonus: { type: 'xpMultiplier', value: 0.02 },
  },
  {
    id: 'fullDiscovery',
    name: 'Full Discovery',
    description: 'Max all Order jobs',
    check: (s) => {
      const orderJobs = JOBS.filter((j) => j.category === 'The Order of Discovery');
      return orderJobs.every((j) => s.jobs[j.id].maxLevel >= 100);
    },
    bonus: { type: 'xpMultiplier', value: 0.02 },
  },
  {
    id: 'royalBlood',
    name: 'Royal Blood',
    description: 'Max all Nobility jobs',
    check: (s) => {
      const nobJobs = JOBS.filter((j) => j.category === 'Nobility');
      return nobJobs.every((j) => s.jobs[j.id].maxLevel >= 100);
    },
    bonus: { type: 'incomeMultiplier', value: 0.025 },
  },
  {
    id: 'eternal',
    name: 'Eternal',
    description: 'Lifespan 500+ years',
    check: (s) => daysToYears(s.player.lifespan) >= 500,
    bonus: { type: 'happinessMultiplier', value: 0.03 },
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Have 1M coins',
    check: (s) => s.player.coins >= 1_000_000,
    bonus: { type: 'incomeMultiplier', value: 0.03 },
  },
  {
    id: 'billionaire',
    name: 'Billionaire',
    description: 'Have 1B coins',
    check: (s) => s.player.coins >= 1_000_000_000,
    bonus: { type: 'incomeMultiplier', value: 0.04 },
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Any skill level 100+',
    check: (s) => Object.values(s.skills).some((sk) => sk.level >= 100),
    bonus: { type: 'xpMultiplier', value: 0.03 },
  },
  {
    id: 'townTycoon',
    name: 'Town Tycoon',
    description: 'Buy 50 town buildings total',
    check: (s) => {
      const totalBuildings = Object.values(s.town).reduce((sum, t) => sum + t.count, 0);
      return totalBuildings >= 50;
    },
    bonus: { type: 'incomeMultiplier', value: 0.03 },
  },
  {
    id: 'fullEvil',
    name: 'Full Evil',
    description: 'Collect 100+ evil',
    check: (s) => s.player.evil >= 100,
    bonus: { type: 'evilMultiplier', value: 0.10 },
  },
  {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: 'Reach 100x game speed',
    check: (s) => getAllTimeMultipliers(s) >= 100,
    bonus: { type: 'xpMultiplier', value: 0.04 },
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Max all skills',
    check: (s) => SKILLS.every((sk) => s.skills[sk.id].maxLevel >= 100),
    bonus: { type: 'xpMultiplier', value: 0.05 },
  },
];

export const ACHIEVEMENT_MAP: Record<string, AchievementDef> = {};
ACHIEVEMENTS.forEach((a) => {
  ACHIEVEMENT_MAP[a.id] = a;
});
