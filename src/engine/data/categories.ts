export const JOB_CATEGORIES = ['Common Work', 'Military', 'The Arcane Association', 'The Order of Discovery', 'Nobility'] as const;
export const SKILL_CATEGORIES = ['Fundamentals', 'Combat', 'Magic', 'Mind', 'Dark Magic'] as const;
export type JobCategory = typeof JOB_CATEGORIES[number];
export type SkillCategory = typeof SKILL_CATEGORIES[number];
