import { JobDef } from '../types';

export const JOBS: JobDef[] = [
  { id: 'beggar', name: 'Beggar', maxXp: 50, income: 5, category: 'Common Work' },
  { id: 'farmer', name: 'Farmer', maxXp: 100, income: 9, category: 'Common Work' },
  { id: 'fisherman', name: 'Fisherman', maxXp: 200, income: 15, category: 'Common Work' },
  { id: 'miner', name: 'Miner', maxXp: 400, income: 40, category: 'Common Work' },
  { id: 'blacksmith', name: 'Blacksmith', maxXp: 800, income: 80, category: 'Common Work' },
  { id: 'merchant', name: 'Merchant', maxXp: 1600, income: 150, category: 'Common Work' },

  { id: 'squire', name: 'Squire', maxXp: 100, income: 5, category: 'Military' },
  { id: 'footman', name: 'Footman', maxXp: 1000, income: 50, category: 'Military' },
  { id: 'veteranFootman', name: 'Veteran footman', maxXp: 10000, income: 120, category: 'Military' },
  { id: 'knight', name: 'Knight', maxXp: 100000, income: 300, category: 'Military' },
  { id: 'veteranKnight', name: 'Veteran knight', maxXp: 1000000, income: 1000, category: 'Military' },
  { id: 'eliteKnight', name: 'Elite knight', maxXp: 7500000, income: 3000, category: 'Military' },
  { id: 'holyKnight', name: 'Holy knight', maxXp: 40000000, income: 15000, category: 'Military' },
  { id: 'legendaryKnight', name: 'Legendary knight', maxXp: 150000000, income: 50000, category: 'Military' },

  { id: 'student', name: 'Student', maxXp: 100000, income: 100, category: 'The Arcane Association' },
  { id: 'apprenticeMage', name: 'Apprentice mage', maxXp: 1000000, income: 1000, category: 'The Arcane Association' },
  { id: 'mage', name: 'Mage', maxXp: 10000000, income: 7500, category: 'The Arcane Association' },
  { id: 'wizard', name: 'Wizard', maxXp: 100000000, income: 50000, category: 'The Arcane Association' },
  { id: 'masterWizard', name: 'Master wizard', maxXp: 10000000000, income: 250000, category: 'The Arcane Association' },
  { id: 'chairman', name: 'Chairman', maxXp: 1000000000000, income: 1000000, category: 'The Arcane Association' },
  { id: 'illustriousChairman', name: 'Illustrious Chairman', maxXp: 7000000000000, income: 1500000, category: 'The Arcane Association' },

  { id: 'juniorCaretaker', name: 'Junior Caretaker', maxXp: 100000, income: 15, category: 'The Order of Discovery' },
  { id: 'leadCaretaker', name: 'Lead Caretaker', maxXp: 1000000, income: 115, category: 'The Order of Discovery' },
  { id: 'freshman', name: 'Freshman', maxXp: 2000000, income: 250, category: 'The Order of Discovery' },
  { id: 'sophomore', name: 'Sophomore', maxXp: 4000000, income: 500, category: 'The Order of Discovery' },
  { id: 'junior', name: 'Junior', maxXp: 16000000, income: 1000, category: 'The Order of Discovery' },
  { id: 'senior', name: 'Senior', maxXp: 64000000, income: 2000, category: 'The Order of Discovery' },
  { id: 'probation', name: 'Probation', maxXp: 300000000, income: 12000, category: 'The Order of Discovery' },

  { id: 'baronet', name: 'Baronet', maxXp: 7500000, income: 3500, category: 'Nobility' },
  { id: 'baron', name: 'Baron', maxXp: 40000000, income: 4500, category: 'Nobility' },
  { id: 'viceCount', name: 'Vice Count', maxXp: 160000000, income: 6000, category: 'Nobility' },
  { id: 'count', name: 'Count', maxXp: 640000000, income: 8000, category: 'Nobility' },
  { id: 'duke', name: 'Duke', maxXp: 2400000000, income: 25000, category: 'Nobility' },
  { id: 'grandDuke', name: 'Grand Duke', maxXp: 9600000000, income: 40000, category: 'Nobility' },
  { id: 'archDuke', name: 'Arch Duke', maxXp: 40000000000, income: 55000, category: 'Nobility' },
  { id: 'lord', name: 'Lord', maxXp: 160000000000, income: 150000, category: 'Nobility' },
  { id: 'highLord', name: 'High Lord', maxXp: 160000000000000, income: 300000, category: 'Nobility' },
  { id: 'king', name: 'King', maxXp: 160000000000000, income: 300000, category: 'Nobility' },
  { id: 'highKing', name: 'High King', maxXp: 160000000000000, income: 1200000, category: 'Nobility' },
  { id: 'emperorOfMankind', name: 'Emperor of Mankind', maxXp: 160000000000000, income: 2500000, category: 'Nobility' },
];

export const JOB_MAP: Record<string, JobDef> = {};
JOBS.forEach(j => { JOB_MAP[j.id] = j; });
