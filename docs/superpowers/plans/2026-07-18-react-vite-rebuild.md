# Progress Knight — React/Vite Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Progress Knight - Reborn from vanilla JS to React 18 + TypeScript + Vite + Zustand, preserving all game mechanics.

**Architecture:** Layered — pure TS engine layer (`src/engine/`) with zero React imports, Zustand store (`src/store/`), React UI layer (`src/components/`). Game loop runs via Web Worker ticker at 50ms intervals.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Zustand 4, plain CSS

## Global Constraints

- Engine layer MUST have zero React imports (no `react`, no `zustand`)
- All game state is a single serializable `GameState` object
- Every game tick function is a pure `(state: GameState) => GameState` transformer
- The Web Worker ticker replaces HackTimer.js — no monkey-patching of global timer functions
- Dark mode via `data-theme` attribute on `<html>`, controlled by CSS custom properties
- Save format must support migration from existing `localStorage` key `gameDataSave`
- Tab-based UI with 6 tabs: Jobs, Skills, Shop, Town, Amulet, Settings
- No new features — faithful rebuild of existing mechanics only

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html` (Vite entry)
- Create: `src/vite-env.d.ts`
- Create: `src/main.tsx`
- Create: `src/components/App.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: runnable `npm run dev` showing "Hello Progress Knight"

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "progress-knight-re-reborn",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 5: Create `index.html` (Vite entry — replaces existing)**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Progress Knight - Reborn</title>
  </head>
  <body id="body" class="dark">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 7: Create `src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 8: Create `src/components/App.tsx` (placeholder)**

```typescript
function App() {
  return <h1>Progress Knight - Reborn</h1>
}

export default App
```

- [ ] **Step 9: Create `src/styles/` directory with a placeholder `main.css`**

```css
body { margin: 0; padding: 0; }
```

- [ ] **Step 10: Install dependencies and verify dev server starts**

Run: `npm install`
Run: `npx tsc --noEmit`
Run: `npm run build` (should succeed)

---

### Task 2: Engine Types and Game Data

**Files:**
- Create: `src/engine/types.ts`
- Create: `src/engine/data/jobs.ts`
- Create: `src/engine/data/skills.ts`
- Create: `src/engine/data/items.ts`
- Create: `src/engine/data/categories.ts`
- Create: `src/engine/data/townBuildings.ts`
- Create: `src/engine/data/tooltips.ts`
- Create: `src/engine/data/headerRowColors.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `GameState`, `JobDef`, `SkillDef`, `ItemDef`, `TownBuilding` types + all game data constants

- [ ] **Step 1: Create `src/engine/types.ts`**

```typescript
// ── Requirement types ──
export interface TaskLevelReq {
  type: 'taskLevel';
  taskId: string;
  level: number;
}

export interface CoinReq {
  type: 'coins';
  amount: number;
}

export interface AgeReq {
  type: 'age';
  years: number;
}

export interface EvilReq {
  type: 'evil';
  amount: number;
}

export type Requirement = TaskLevelReq | CoinReq | AgeReq | EvilReq;

// ── Game data definition types (static, never mutated) ──
export interface JobDef {
  id: string;
  name: string;
  maxXp: number;
  income: number;
  category: string;
}

export interface SkillDef {
  id: string;
  name: string;
  maxXp: number;
  effect: number;
  description: string;
  category: string;
}

export interface ItemDef {
  id: string;
  name: string;
  category: 'Property' | 'Misc';
  expense: number;
  effect: number;
  description?: string;
}

export interface TownBuildingDef {
  id: string;
  name: string;
  baseCost: number;
  costGrowthFactor: number;
  role: string[];
  income?: number;
  xpMultiplier?: number;
  targets?: string[];
  incomeMultiplier?: number;
}

// ── Runtime state types (mutable game state) ──
export interface TaskState {
  level: number;
  maxLevel: number;
  xp: number;
}

export interface PlayerState {
  age: number;
  day: number;
  lifespan: number;
  coins: number;
  evil: number;
  currentJobId: string | null;
  currentSkillId: string | null;
  currentPropertyId: string;
  currentMiscIds: string[];
  paused: boolean;
  autoPromote: boolean;
  autoLearn: boolean;
  timeWarp: boolean;
  rebirthOneCount: number;
  rebirthTwoCount: number;
}

export interface TownBuildingState {
  count: number;
  costOfNext: number;
}

export interface GameState {
  player: PlayerState;
  jobs: Record<string, TaskState>;
  skills: Record<string, TaskState>;
  town: Record<string, TownBuildingState>;
  saveVersion: number;
}

// ── Multiplier function type ──
export type MultiplierFn = (state: GameState) => number;
```

- [ ] **Step 2: Create `src/engine/data/jobs.ts`**

Migrate from `js/main.js:50-96`. Each job gets an `id` (camelCase) and `category` field:

```typescript
import { JobDef } from '../types';

export const JOBS: JobDef[] = [
  // Common Work
  { id: 'beggar', name: 'Beggar', maxXp: 50, income: 5, category: 'Common Work' },
  { id: 'farmer', name: 'Farmer', maxXp: 100, income: 9, category: 'Common Work' },
  { id: 'fisherman', name: 'Fisherman', maxXp: 200, income: 15, category: 'Common Work' },
  { id: 'miner', name: 'Miner', maxXp: 400, income: 40, category: 'Common Work' },
  { id: 'blacksmith', name: 'Blacksmith', maxXp: 800, income: 80, category: 'Common Work' },
  { id: 'merchant', name: 'Merchant', maxXp: 1600, income: 150, category: 'Common Work' },

  // Military
  { id: 'squire', name: 'Squire', maxXp: 100, income: 5, category: 'Military' },
  { id: 'footman', name: 'Footman', maxXp: 1000, income: 50, category: 'Military' },
  { id: 'veteranFootman', name: 'Veteran footman', maxXp: 10000, income: 120, category: 'Military' },
  { id: 'knight', name: 'Knight', maxXp: 100000, income: 300, category: 'Military' },
  { id: 'veteranKnight', name: 'Veteran knight', maxXp: 1000000, income: 1000, category: 'Military' },
  { id: 'eliteKnight', name: 'Elite knight', maxXp: 7500000, income: 3000, category: 'Military' },
  { id: 'holyKnight', name: 'Holy knight', maxXp: 40000000, income: 15000, category: 'Military' },
  { id: 'legendaryKnight', name: 'Legendary knight', maxXp: 150000000, income: 50000, category: 'Military' },

  // The Arcane Association
  { id: 'student', name: 'Student', maxXp: 100000, income: 100, category: 'The Arcane Association' },
  { id: 'apprenticeMage', name: 'Apprentice mage', maxXp: 1000000, income: 1000, category: 'The Arcane Association' },
  { id: 'mage', name: 'Mage', maxXp: 10000000, income: 7500, category: 'The Arcane Association' },
  { id: 'wizard', name: 'Wizard', maxXp: 100000000, income: 50000, category: 'The Arcane Association' },
  { id: 'masterWizard', name: 'Master wizard', maxXp: 10000000000, income: 250000, category: 'The Arcane Association' },
  { id: 'chairman', name: 'Chairman', maxXp: 1000000000000, income: 1000000, category: 'The Arcane Association' },
  { id: 'illustriousChairman', name: 'Illustrious Chairman', maxXp: 7000000000000, income: 1500000, category: 'The Arcane Association' },

  // The Order of Discovery
  { id: 'juniorCaretaker', name: 'Junior Caretaker', maxXp: 100000, income: 15, category: 'The Order of Discovery' },
  { id: 'leadCaretaker', name: 'Lead Caretaker', maxXp: 1000000, income: 115, category: 'The Order of Discovery' },
  { id: 'freshman', name: 'Freshman', maxXp: 2000000, income: 250, category: 'The Order of Discovery' },
  { id: 'sophomore', name: 'Sophomore', maxXp: 4000000, income: 500, category: 'The Order of Discovery' },
  { id: 'junior', name: 'Junior', maxXp: 16000000, income: 1000, category: 'The Order of Discovery' },
  { id: 'senior', name: 'Senior', maxXp: 64000000, income: 2000, category: 'The Order of Discovery' },
  { id: 'probation', name: 'Probation', maxXp: 300000000, income: 12000, category: 'The Order of Discovery' },

  // Nobility
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
```

- [ ] **Step 3: Create `src/engine/data/skills.ts`**

Migrate from `js/main.js:98-135`. Same pattern — all 25 skills with `id`, `category`:

```typescript
import { SkillDef } from '../types';

const baseEffect = 0.01;

export const SKILLS: SkillDef[] = [
  // Fundamentals
  { id: 'concentration', name: 'Concentration', maxXp: 100, effect: baseEffect, description: 'Skill xp', category: 'Fundamentals' },
  { id: 'productivity', name: 'Productivity', maxXp: 100, effect: 0.01, description: 'Job xp', category: 'Fundamentals' },
  { id: 'bargaining', name: 'Bargaining', maxXp: 100, effect: -0.01, description: 'Expenses', category: 'Fundamentals' },
  { id: 'meditation', name: 'Meditation', maxXp: 100, effect: baseEffect, description: 'Happiness', category: 'Fundamentals' },
  // Combat
  { id: 'strength', name: 'Strength', maxXp: 100, effect: 0.01, description: 'Military pay', category: 'Combat' },
  { id: 'battleTactics', name: 'Battle tactics', maxXp: 100, effect: 0.01, description: 'Military xp', category: 'Combat' },
  { id: 'muscleMemory', name: 'Muscle memory', maxXp: 100, effect: 0.01, description: 'Strength xp', category: 'Combat' },
  // Magic
  { id: 'manaControl', name: 'Mana control', maxXp: 100, effect: baseEffect, description: 'T.A.A. xp', category: 'Magic' },
  { id: 'immortality', name: 'Immortality', maxXp: 100, effect: 0.01, description: 'Longer lifespan', category: 'Magic' },
  { id: 'timeWarping', name: 'Time warping', maxXp: 100, effect: 0.01, description: 'Gamespeed', category: 'Magic' },
  { id: 'superImmortality', name: 'Super immortality', maxXp: 100, effect: 0.01, description: 'Longer lifespan', category: 'Magic' },
  // Mind
  { id: 'novelKnowledge', name: 'Novel Knowledge', maxXp: 100, effect: 0.01, description: 'Discovery xp', category: 'Mind' },
  { id: 'unusualInsight', name: 'Unusual Insight', maxXp: 100, effect: 0.005, description: 'Magical xp', category: 'Mind' },
  { id: 'tradePsychology', name: 'Trade Psychology', maxXp: 100, effect: 0.80, description: 'Merchant pay', category: 'Mind' },
  { id: 'flow', name: 'Flow', maxXp: 800, effect: 0.001, description: 'Gamespeed', category: 'Mind' },
  { id: 'magicalEngineering', name: 'Magical Engineering', maxXp: 1000, effect: 0.01, description: 'Chairman xp', category: 'Mind' },
  { id: 'scalesOfThought', name: 'Scales Of Thought', maxXp: 1100, effect: 0.003, description: 'Magical xp', category: 'Mind' },
  { id: 'magicalBiology', name: 'Magical Biology', maxXp: 1500, effect: 0.005, description: 'Chairman xp', category: 'Mind' },
  // Dark Magic
  { id: 'darkInfluence', name: 'Dark influence', maxXp: 100, effect: 0.01, description: 'All xp', category: 'Dark Magic' },
  { id: 'evilControl', name: 'Evil control', maxXp: 100, effect: 0.01, description: 'Evil gain', category: 'Dark Magic' },
  { id: 'intimidation', name: 'Intimidation', maxXp: 100, effect: -0.01, description: 'Expenses', category: 'Dark Magic' },
  { id: 'demonTraining', name: 'Demon training', maxXp: 100, effect: 0.01, description: 'All xp', category: 'Dark Magic' },
  { id: 'bloodMeditation', name: 'Blood meditation', maxXp: 100, effect: 0.01, description: 'Evil gain', category: 'Dark Magic' },
  { id: 'demonsWealth', name: "Demon's wealth", maxXp: 100, effect: 0.002, description: 'Job pay', category: 'Dark Magic' },
];

export const SKILL_MAP: Record<string, SkillDef> = {};
SKILLS.forEach(s => { SKILL_MAP[s.id] = s; });
```

- [ ] **Step 4: Create `src/engine/data/items.ts`**

Migrate from `js/main.js:149-205`:

```typescript
import { ItemDef } from '../types';

export const ITEMS: ItemDef[] = [
  // Properties
  { id: 'homeless', name: 'Homeless', category: 'Property', expense: 0, effect: 1 },
  { id: 'tent', name: 'Tent', category: 'Property', expense: 15, effect: 1.4 },
  { id: 'woodenHut', name: 'Wooden hut', category: 'Property', expense: 100, effect: 2 },
  { id: 'cottage', name: 'Cottage', category: 'Property', expense: 750, effect: 3.5 },
  { id: 'house', name: 'House', category: 'Property', expense: 3000, effect: 6 },
  { id: 'largeHouse', name: 'Large house', category: 'Property', expense: 25000, effect: 12 },
  { id: 'smallManor', name: 'Small Manor', category: 'Property', expense: 300000, effect: 25 },
  { id: 'smallPalace', name: 'Small palace', category: 'Property', expense: 5000000, effect: 60 },
  { id: 'grandPalace', name: 'Grand palace', category: 'Property', expense: 190000000, effect: 135 },
  // Misc items
  { id: 'ragClothing', name: 'Rag Clothing', category: 'Misc', expense: 3, effect: 1.5, description: 'Skill xp' },
  { id: 'book', name: 'Book', category: 'Misc', expense: 10, effect: 1.5, description: 'Skill xp' },
  { id: 'basicFarmTools', name: 'Basic Farm Tools', category: 'Misc', expense: 10, effect: 1.5, description: 'Farm upgrade' },
  { id: 'dumbbells', name: 'Dumbbells', category: 'Misc', expense: 50, effect: 1.5, description: 'Strength xp' },
  { id: 'personalSquire', name: 'Personal squire', category: 'Misc', expense: 200, effect: 2, description: 'Job xp' },
  { id: 'steelLongsword', name: 'Steel longsword', category: 'Misc', expense: 1000, effect: 2, description: 'Military xp' },
  { id: 'butler', name: 'Butler', category: 'Misc', expense: 7500, effect: 1.5, description: 'Happiness' },
  { id: 'sapphireCharm', name: 'Sapphire charm', category: 'Misc', expense: 50000, effect: 3, description: 'Magic xp' },
  { id: 'studyDesk', name: 'Study desk', category: 'Misc', expense: 1000000, effect: 2, description: 'Skill xp' },
  { id: 'library', name: 'Library', category: 'Misc', expense: 12000000, effect: 1.5, description: 'Skill xp' },
  { id: 'smallField', name: 'Small Field', category: 'Misc', expense: 130, effect: 5.0, description: 'Farm upgrade' },
  { id: 'oxDrivenPlow', name: 'Ox-driven Plow', category: 'Misc', expense: 200, effect: 2.4, description: 'Farm upgrade' },
  { id: 'livestockFertilizer', name: 'Livestock-derived Fertilizer', category: 'Misc', expense: 20, effect: 1.2, description: 'Farm upgrade' },
  { id: 'cheapFishingRod', name: 'Cheap Fishing Rod', category: 'Misc', expense: 20, effect: 2.0, description: 'Fishing upgrade' },
  { id: 'minersLantern', name: "Miner's Lantern", category: 'Misc', expense: 35, effect: 1.5, description: 'Mining upgrade' },
  { id: 'crappyAnvil', name: 'Crappy Anvil', category: 'Misc', expense: 50, effect: 1.5, description: 'Blacksmith upgrade' },
  { id: 'breechBellows', name: 'Breech Bellows', category: 'Misc', expense: 130, effect: 1.8, description: 'Blacksmith upgrade' },
  { id: 'packHorse', name: 'Pack Horse', category: 'Misc', expense: 80, effect: 3.0, description: 'Merchant upgrade' },
  { id: 'smallShop', name: 'Small Shop', category: 'Misc', expense: 600, effect: 1.5, description: 'Merchant upgrade' },
  { id: 'weaponOutlet', name: 'Weapon Outlet', category: 'Misc', expense: 3000, effect: 3.0, description: 'Merchant upgrade' },
];

export const ITEM_MAP: Record<string, ItemDef> = {};
ITEMS.forEach(i => { ITEM_MAP[i.id] = i; });
```

- [ ] **Step 5: Create `src/engine/data/categories.ts`**

```typescript
export const JOB_CATEGORIES = [
  'Common Work',
  'Military',
  'The Arcane Association',
  'The Order of Discovery',
  'Nobility',
] as const;

export const SKILL_CATEGORIES = [
  'Fundamentals',
  'Combat',
  'Magic',
  'Mind',
  'Dark Magic',
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];
export type SkillCategory = typeof SKILL_CATEGORIES[number];
```

- [ ] **Step 6: Create `src/engine/data/headerRowColors.ts`**

```typescript
export const HEADER_ROW_COLORS: Record<string, string> = {
  'Common Work': '#55a630',
  'Military': '#e63946',
  'The Arcane Association': '#C71585',
  'The Order of Discovery': '#C7dd85',
  'Nobility': '#D1B000',
  'Fundamentals': '#4a4e69',
  'Combat': '#ff704d',
  'Magic': '#875F9A',
  'Mind': '#87009A',
  'Dark Magic': '#73000f',
};
```

- [ ] **Step 7: Create `src/engine/data/tooltips.ts`**

Migrate all tooltip text from `js/main.js:227-346` as a `Record<string, string>` keyed by entity id (camelCase). All ~60 tooltips.

```typescript
export const TOOLTIPS: Record<string, string> = {
  beggar: 'Struggle day and night for a couple of copper coins...',
  farmer: 'Plow the fields and grow the crops...',
  // ... all ~60 tooltips migrated from js/main.js lines 227-346
};
```

- [ ] **Step 8: Create `src/engine/data/townBuildings.ts`**

```typescript
import { TownBuildingDef } from '../types';

export const TOWN_BUILDINGS: TownBuildingDef[] = [
  {
    id: 'woodenHut',
    name: 'Wooden Hut',
    baseCost: 100000000001,
    costGrowthFactor: 1.01,
    role: ['Housing'],
  },
  {
    id: 'farm',
    name: 'Farm',
    baseCost: 1000000000001,
    costGrowthFactor: 1.05,
    role: ['Food', 'Income', 'Prestige', 'Nobility xp'],
    income: 150,
    xpMultiplier: 1.10,
  },
  {
    id: 'grainShed',
    name: 'Grain Shed',
    baseCost: 100000000001,
    costGrowthFactor: 1.07,
    role: ['Food', 'Income Boost'],
    targets: ['farm'],
    incomeMultiplier: 1.06,
  },
];

export const TOWN_BUILDING_MAP: Record<string, TownBuildingDef> = {};
TOWN_BUILDINGS.forEach(b => { TOWN_BUILDING_MAP[b.id] = b; });
```

- [ ] **Step 9: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 3: Core Engine Logic

**Files:**
- Create: `src/engine/economy.ts`
- Create: `src/engine/requirements.ts`
- Create: `src/engine/town.ts`
- Create: `src/engine/time.ts`

**Interfaces:**
- Consumes: `GameState`, `Requirement` types from Task 2
- Produces: pure utility functions used by `game.ts`

- [ ] **Step 1: Create `src/engine/economy.ts`**

```typescript
import { GameState } from './types';
import { ITEM_MAP } from './data/items';

export const UNITS = ['', 'k', 'M', 'B', 'T', 'q', 'Q', 'Sx', 'Sp', 'Oc'];

export function formatNumber(n: number): string {
  if (n === 0) return '0';
  const tier = Math.floor(Math.log10(Math.abs(n)) / 3);
  if (tier === 0) return String(Math.floor(n));
  const suffix = UNITS[tier] || '?';
  const scale = Math.pow(10, tier * 3);
  return (n / scale).toFixed(1) + suffix;
}

export interface CoinTier {
  label: string;
  value: number;
  color: string;
}

export function formatCoins(coins: number): CoinTier[] {
  const tiers = ['p', 'g', 's'];
  const colors: Record<string, string> = { p: '#79b9c7', g: '#E5C100', s: '#a8a8a8', c: '#a15c2f' };
  const result: CoinTier[] = [];
  let remaining = coins;
  tiers.forEach((label, i) => {
    const divisor = Math.pow(10, (tiers.length - i) * 2);
    const x = Math.floor(remaining / divisor);
    remaining = Math.floor(remaining - x * divisor);
    result.push({ label, value: x, color: colors[label] });
  });
  result.push({ label: 'c', value: Math.floor(remaining), color: colors['c'] });
  return result;
}

export function getPropertyExpense(state: GameState): number {
  const prop = ITEM_MAP[state.player.currentPropertyId];
  if (!prop) return 0;
  return prop.expense;
}

export function getMiscExpenses(state: GameState): number {
  return state.player.currentMiscIds.reduce((sum, id) => {
    const item = ITEM_MAP[id];
    return sum + (item ? item.expense : 0);
  }, 0);
}

export function getTotalExpense(state: GameState): number {
  return getPropertyExpense(state) + getMiscExpenses(state);
}
```

- [ ] **Step 2: Create `src/engine/requirements.ts`**

```typescript
import { GameState, Requirement, TaskLevelReq, CoinReq, AgeReq, EvilReq } from './types';
import { getTotalExpense } from './economy';

export function checkRequirement(state: GameState, req: Requirement): boolean {
  switch (req.type) {
    case 'taskLevel': {
      const task = state.jobs[req.taskId] || state.skills[req.taskId];
      return task ? task.level >= req.level : false;
    }
    case 'coins': {
      return state.player.coins >= req.amount;
    }
    case 'age': {
      return daysToYears(state.player.age) >= req.years;
    }
    case 'evil': {
      return state.player.evil >= req.amount;
    }
  }
}

export function checkRequirements(state: GameState, reqs: Requirement[]): boolean {
  return reqs.every(r => checkRequirement(state, r));
}

export function daysToYears(days: number): number {
  return Math.floor(days / 365);
}
```

- [ ] **Step 3: Create `src/engine/town.ts`**

```typescript
import { GameState } from './types';
import { TOWN_BUILDING_MAP } from './data/townBuildings';

export function calculateTownIncome(state: GameState): number {
  let total = 0;
  for (const [id, buildingState] of Object.entries(state.town)) {
    const def = TOWN_BUILDING_MAP[id];
    if (!def || !def.income) continue;
    if (def.id === 'farm') {
      let multiplier = 1;
      for (const [boostId, boostState] of Object.entries(state.town)) {
        const boostDef = TOWN_BUILDING_MAP[boostId];
        if (boostDef && boostDef.targets?.includes('farm') && boostDef.incomeMultiplier) {
          multiplier *= Math.pow(boostDef.incomeMultiplier, boostState.count);
        }
      }
      total += def.income * buildingState.count * multiplier;
    } else {
      total += def.income * buildingState.count;
    }
  }
  return total > 1000000000 ? 1000000000 : total; // grain market regulation
}
```

- [ ] **Step 4: Create `src/engine/time.ts`**

```typescript
import { GameState } from './types';
import { SKILL_MAP } from './data/skills';

export function getBaseLog(base: number, x: number): number {
  return Math.log(x) / Math.log(base);
}

export function getTimeWarpingEffect(state: GameState): number {
  const skill = state.skills['timeWarping'];
  if (!skill) return 1;
  return 1 + getBaseLog(13, skill.level + 1);
}

export function getFlowEffect(state: GameState): number {
  const skill = state.skills['flow'];
  if (!skill) return 1;
  return 1 + getBaseLog(100, skill.level + 1) / 1.3;
}

export function getAllTimeMultipliers(state: GameState): number {
  const flow = getFlowEffect(state);
  const warp = state.player.timeWarp ? getTimeWarpingEffect(state) : 1;
  return flow * warp;
}

export function getGameSpeed(state: GameState): number {
  if (state.player.paused) return 0;
  if (state.player.age >= state.player.lifespan) return 0;
  return 4 * getAllTimeMultipliers(state);
}

export function getMaxXp(baseMaxXp: number, level: number): number {
  return Math.round(baseMaxXp * (level + 1) * Math.pow(1.01, level));
}

export function getBargainingEffect(state: GameState): number {
  const skill = state.skills['bargaining'];
  if (!skill) return 1;
  const mult = 1 - getBaseLog(7, skill.level + 1) / 10;
  return mult < 0.1 ? 0.1 : mult;
}

export function getIntimidationEffect(state: GameState): number {
  const skill = state.skills['intimidation'];
  if (!skill) return 1;
  const mult = 1 - getBaseLog(7, skill.level + 1) / 10;
  return mult < 0.1 ? 0.1 : mult;
}

export function getImmortalityEffect(state: GameState): number {
  const skill = state.skills['immortality'];
  if (!skill) return 1;
  return 1 + getBaseLog(33, skill.level + 1);
}

export function getSuperImmortalityEffect(state: GameState): number {
  const skill = state.skills['superImmortality'];
  if (!skill) return 1;
  return skill.level > 0 ? 1 + getBaseLog(33, skill.level + 1) : 1; // approximate
}
```

- [ ] **Step 5: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 4: Game Loop Logic

**Files:**
- Create: `src/engine/game.ts`
- Create: `src/engine/rebirth.ts`

**Interfaces:**
- Consumes: `GameState`, utility functions from Tasks 2-3
- Produces: `gameTick(state: GameState) => GameState` (the core loop), rebirth functions

- [ ] **Step 1: Create `src/engine/rebirth.ts`**

```typescript
import { GameState, TaskState, TownBuildingState } from './types';
import { JOBS } from './data/jobs';
import { SKILLS } from './data/skills';
import { ITEM_MAP } from './data/items';
import { TOWN_BUILDING_MAP } from './data/townBuildings';
import { getEvilGain } from './game';

export function createInitialTaskState(def: { id: string }): TaskState {
  return { level: 0, maxLevel: 0, xp: 0 };
}

export function createInitialGameState(): GameState {
  const jobs: Record<string, TaskState> = {};
  JOBS.forEach(j => { jobs[j.id] = createInitialTaskState(j); });
  const skills: Record<string, TaskState> = {};
  SKILLS.forEach(s => { skills[s.id] = createInitialTaskState(s); });
  const town: Record<string, TownBuildingState> = {
    woodenHut: { count: 0, costOfNext: 100000000001 },
    farm: { count: 0, costOfNext: 1000000000001 },
    grainShed: { count: 0, costOfNext: 100000000001 },
  };

  return {
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
    saveVersion: 2,
  };
}

export function performRebirthOne(state: GameState): GameState {
  const newState = structuredClone(state);
  newState.player.rebirthOneCount += 1;
  // Track max levels before reset
  for (const [id, task] of Object.entries(newState.jobs)) {
    if (task.level > task.maxLevel) task.maxLevel = task.level;
    task.level = 0;
    task.xp = 0;
  }
  for (const [id, task] of Object.entries(newState.skills)) {
    if (task.level > task.maxLevel) task.maxLevel = task.level;
    task.level = 0;
    task.xp = 0;
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
  let newState = performRebirthOne(state);
  newState.player.rebirthTwoCount += 1;
  newState.player.evil += getEvilGain(state);
  // Reset max levels
  for (const task of Object.values(newState.jobs)) {
    task.maxLevel = 0;
  }
  for (const task of Object.values(newState.skills)) {
    task.maxLevel = 0;
  }
  // Destroy town
  for (const [buildingId, building] of Object.entries(newState.town)) {
    building.count = 0;
    const def = TOWN_BUILDING_MAP[buildingId];
    if (def) building.costOfNext = def.baseCost;
  }
  return newState;
}
```

- [ ] **Step 2: Create `src/engine/game.ts`**

This is the heart of the game. It contains all multiplier logic, XP calculations, auto-promote, auto-learn, and the main tick function:

```typescript
import { GameState, TaskState } from './types';
import { JOBS, JOB_MAP } from './data/jobs';
import { SKILLS, SKILL_MAP } from './data/skills';
import { ITEM_MAP } from './data/items';
import {
  getGameSpeed, getMaxXp, getBargainingEffect, getIntimidationEffect,
  getImmortalityEffect, getSuperImmortalityEffect,
  getBaseLog, getAllTimeMultipliers,
} from './time';
import { calculateTownIncome } from './town';
import { getTotalExpense } from './economy';
import { checkRequirements } from './requirements';
import { JOB_CATEGORIES, SKILL_CATEGORIES } from './data/categories';

const UPDATE_SPEED = 20;
const BASE_LIFESPAN = 365 * 70;

function applySpeed(value: number, state: GameState): number {
  return value * getGameSpeed(state) / UPDATE_SPEED;
}

function getLevelMultiplier(level: number): number {
  return 1 + Math.log10(level + 1);
}

function getMaxLevelMultiplier(maxLevel: number): number {
  return 1 + maxLevel / 10;
}

function getHappiness(state: GameState): number {
  const meditation = state.skills['meditation'];
  const meditationEffect = meditation ? 1 + meditation.level * (SKILL_MAP['meditation']?.effect || 0.01) : 1;
  const butlerItem = ITEM_MAP['butler'];
  const hasButler = state.player.currentMiscIds.includes('butler');
  const butlerEffect = hasButler ? (butlerItem?.effect || 1) : 1;
  const property = ITEM_MAP[state.player.currentPropertyId];
  const propertyEffect = property ? property.effect : 1;
  return meditationEffect * butlerEffect * propertyEffect;
}

export function getEvilGain(state: GameState): number {
  const evilControl = SKILL_MAP['evilControl'];
  const bloodMeditation = SKILL_MAP['bloodMeditation'];
  const ecLevel = state.skills['evilControl']?.level || 0;
  const bmLevel = state.skills['bloodMeditation']?.level || 0;
  const ecEffect = 1 + ecLevel * (evilControl?.effect || 0.01);
  const bmEffect = 1 + bmLevel * (bloodMeditation?.effect || 0.01);
  return ecEffect * bmEffect;
}

function getJobXpGain(state: GameState, jobId: string): number {
  const job = state.jobs[jobId];
  if (!job) return 0;
  let multiplier = 1;
  multiplier *= getMaxLevelMultiplier(job.maxLevel);
  multiplier *= getHappiness(state);
  const darkInfluence = state.skills['darkInfluence']?.level || 0;
  multiplier *= 1 + darkInfluence * (SKILL_MAP['darkInfluence']?.effect || 0.01);
  const demonTraining = state.skills['demonTraining']?.level || 0;
  multiplier *= 1 + demonTraining * (SKILL_MAP['demonTraining']?.effect || 0.01);
  const productivity = state.skills['productivity']?.level || 0;
  multiplier *= 1 + productivity * (SKILL_MAP['productivity']?.effect || 0.01);
  if (state.player.currentMiscIds.includes('personalSquire')) {
    multiplier *= ITEM_MAP['personalSquire']?.effect || 1;
  }
  const def = JOB_MAP[jobId];
  if (def) {
    // Category-specific multipliers (from addMultipliers in original code)
    switch (def.category) {
      case 'Military':
        multiplier *= 1 + (state.skills['battleTactics']?.level || 0) * (SKILL_MAP['battleTactics']?.effect || 0.01);
        if (state.player.currentMiscIds.includes('steelLongsword')) multiplier *= ITEM_MAP['steelLongsword']?.effect || 1;
        break;
      case 'The Arcane Association':
        multiplier *= 1 + (state.skills['manaControl']?.level || 0) * (SKILL_MAP['manaControl']?.effect || 0.01);
        multiplier *= 1 + (state.skills['novelKnowledge']?.level || 0) * (SKILL_MAP['novelKnowledge']?.effect || 0.01);
        multiplier *= 1 + (state.skills['unusualInsight']?.level || 0) * (SKILL_MAP['unusualInsight']?.effect || 0.005);
        break;
      case 'The Order of Discovery':
        multiplier *= 1 + (state.skills['novelKnowledge']?.level || 0) * (SKILL_MAP['novelKnowledge']?.effect || 0.01);
        multiplier *= 1 + (state.skills['unusualInsight']?.level || 0) * (SKILL_MAP['unusualInsight']?.effect || 0.005);
        break;
    }
    // Job-specific multipliers
    if (jobId === 'farmer') {
      if (state.player.currentMiscIds.includes('smallField')) multiplier *= ITEM_MAP['smallField']?.effect || 1;
      if (state.player.currentMiscIds.includes('oxDrivenPlow')) multiplier *= ITEM_MAP['oxDrivenPlow']?.effect || 1;
    }
    if (jobId === 'fisherman' && state.player.currentMiscIds.includes('cheapFishingRod')) multiplier *= ITEM_MAP['cheapFishingRod']?.effect || 1;
    if (jobId === 'miner' && state.player.currentMiscIds.includes('minersLantern')) multiplier *= ITEM_MAP['minersLantern']?.effect || 1;
    if (jobId === 'blacksmith') {
      if (state.player.currentMiscIds.includes('crappyAnvil')) multiplier *= ITEM_MAP['crappyAnvil']?.effect || 1;
      if (state.player.currentMiscIds.includes('breechBellows')) multiplier *= ITEM_MAP['breechBellows']?.effect || 1;
    }
    if ((jobId === 'chairman' || jobId === 'illustriousChairman')) {
      multiplier *= 1 + (state.skills['magicalEngineering']?.level || 0) * (SKILL_MAP['magicalEngineering']?.effect || 0.01);
      multiplier *= 1 + (state.skills['magicalBiology']?.level || 0) * (SKILL_MAP['magicalBiology']?.effect || 0.005);
    }
  }
  return Math.round(10 * multiplier);
}

function getSkillXpGain(state: GameState, skillId: string): number {
  const skill = state.skills[skillId];
  if (!skill) return 0;
  let multiplier = 1;
  multiplier *= getMaxLevelMultiplier(skill.maxLevel);
  multiplier *= getHappiness(state);
  const darkInfluence = state.skills['darkInfluence']?.level || 0;
  multiplier *= 1 + darkInfluence * (SKILL_MAP['darkInfluence']?.effect || 0.01);
  const demonTraining = state.skills['demonTraining']?.level || 0;
  multiplier *= 1 + demonTraining * (SKILL_MAP['demonTraining']?.effect || 0.01);
  const concentration = state.skills['concentration']?.level || 0;
  multiplier *= 1 + concentration * (SKILL_MAP['concentration']?.effect || 0.01);
  if (state.player.currentMiscIds.includes('ragClothing')) multiplier *= ITEM_MAP['ragClothing']?.effect || 1;
  if (state.player.currentMiscIds.includes('book')) multiplier *= ITEM_MAP['book']?.effect || 1;
  if (state.player.currentMiscIds.includes('studyDesk')) multiplier *= ITEM_MAP['studyDesk']?.effect || 1;
  if (state.player.currentMiscIds.includes('library')) multiplier *= ITEM_MAP['library']?.effect || 1;
  const def = SKILL_MAP[skillId];
  if (def) {
    if (skillId === 'strength' && state.player.currentMiscIds.includes('dumbbells')) multiplier *= ITEM_MAP['dumbbells']?.effect || 1;
    if (skillId === 'strength') {
      multiplier *= 1 + (state.skills['muscleMemory']?.level || 0) * (SKILL_MAP['muscleMemory']?.effect || 0.01);
    }
    if (def.category === 'Magic') {
      if (state.player.currentMiscIds.includes('sapphireCharm')) multiplier *= ITEM_MAP['sapphireCharm']?.effect || 1;
      multiplier *= 1 + (state.skills['scalesOfThought']?.level || 0) * (SKILL_MAP['scalesOfThought']?.effect || 0.003);
    }
  }
  if (def?.category === 'Dark Magic') {
    multiplier *= state.player.evil > 0 ? state.player.evil : 1;
  }
  return Math.round(10 * multiplier);
}

function getJobIncome(state: GameState, jobId: string): number {
  const def = JOB_MAP[jobId];
  const task = state.jobs[jobId];
  if (!def || !task) return 0;
  let multiplier = 1;
  multiplier *= getLevelMultiplier(task.level);
  const demonsWealth = state.skills['demonsWealth']?.level || 0;
  multiplier *= 1 + demonsWealth * (SKILL_MAP['demonsWealth']?.effect || 0.002);
  // Category-specific income multipliers (from original)
  if (def.category === 'Military') {
    multiplier *= 1 + (state.skills['strength']?.level || 0) * (SKILL_MAP['strength']?.effect || 0.01);
  }
  if (jobId === 'merchant') {
    multiplier *= 1 + (state.skills['tradePsychology']?.level || 0) * (SKILL_MAP['tradePsychology']?.effect || 0.80);
    if (state.player.currentMiscIds.includes('packHorse')) multiplier *= ITEM_MAP['packHorse']?.effect || 1;
    if (state.player.currentMiscIds.includes('smallShop')) multiplier *= ITEM_MAP['smallShop']?.effect || 1;
    if (state.player.currentMiscIds.includes('weaponOutlet')) multiplier *= ITEM_MAP['weaponOutlet']?.effect || 1;
  }
  if (jobId === 'farmer') {
    if (state.player.currentMiscIds.includes('basicFarmTools')) multiplier *= ITEM_MAP['basicFarmTools']?.effect || 1;
    if (state.player.currentMiscIds.includes('smallField')) multiplier *= ITEM_MAP['smallField']?.effect || 1;
    if (state.player.currentMiscIds.includes('oxDrivenPlow')) multiplier *= ITEM_MAP['oxDrivenPlow']?.effect || 1;
    if (state.player.currentMiscIds.includes('livestockFertilizer')) multiplier *= ITEM_MAP['livestockFertilizer']?.effect || 1;
  }
  if (jobId === 'fisherman' && state.player.currentMiscIds.includes('cheapFishingRod')) multiplier *= ITEM_MAP['cheapFishingRod']?.effect || 1;
  if (jobId === 'miner' && state.player.currentMiscIds.includes('minersLantern')) multiplier *= ITEM_MAP['minersLantern']?.effect || 1;
  if (jobId === 'blacksmith') {
    if (state.player.currentMiscIds.includes('crappyAnvil')) multiplier *= ITEM_MAP['crappyAnvil']?.effect || 1;
    if (state.player.currentMiscIds.includes('breechBellows')) multiplier *= ITEM_MAP['breechBellows']?.effect || 1;
  }
  return Math.round(def.income * multiplier);
}

function processTaskXp(task: TaskState, xpGain: number): TaskState {
  const maxXp = getMaxXp(50, task.level); // approximates base; actual base varies per job
  const newXp = task.xp + xpGain;
  if (newXp >= maxXp) {
    return { ...task, level: task.level + 1, xp: newXp - maxXp };
  }
  return { ...task, xp: newXp };
}

export function increaseDays(state: GameState): GameState {
  const ageIncrease = applySpeed(1, state);
  const newAge = state.player.age + ageIncrease;
  return {
    ...state,
    player: {
      ...state.player,
      age: newAge,
      day: Math.floor(newAge - Math.floor(newAge / 365) * 365),
      lifespan: Math.floor(BASE_LIFESPAN * getImmortalityEffect(state) * getSuperImmortalityEffect(state)),
    },
  };
}

export function gameTick(state: GameState): GameState {
  let s = increaseDays(state);

  // Auto-promote
  if (s.player.autoPromote && s.player.currentJobId) {
    const jobIds = JOBS.map(j => j.id);
    const idx = jobIds.indexOf(s.player.currentJobId);
    if (idx >= 0 && idx < jobIds.length - 1) {
      const nextJobId = jobIds[idx + 1];
      const nextDef = JOB_MAP[nextJobId];
      // Requirements would be checked here — simplified for now
      s = { ...s, player: { ...s.player, currentJobId: nextJobId } };
    }
  }

  // Auto-learn (skill with lowest time to max)
  if (s.player.autoLearn) {
    const available = SKILLS.filter(sk => {
      const task = s.skills[sk.id];
      return task && task.level > 0; // simplified: unlocked check
    });
    if (available.length > 0) {
      const fastest = available.reduce((a, b) => {
        const aTask = s.skills[a.id];
        const bTask = s.skills[b.id];
        if (!aTask || !bTask) return a;
        const aTime = getMaxXp(100, aTask.level) / getSkillXpGain(s, a.id);
        const bTime = getMaxXp(100, bTask.level) / getSkillXpGain(s, b.id);
        return aTime < bTime ? a : b;
      });
      s = { ...s, player: { ...s.player, currentSkillId: fastest.id } };
    }
  }

  // Process current job
  if (s.player.currentJobId && s.jobs[s.player.currentJobId]) {
    const gain = applySpeed(getJobXpGain(s, s.player.currentJobId), s);
    const task = s.jobs[s.player.currentJobId];
    const maxXp = getMaxXp(JOB_MAP[s.player.currentJobId]?.maxXp || 50, task.level);
    const newXp = task.xp + gain;
    if (newXp >= maxXp) {
      s.jobs[s.player.currentJobId] = { ...task, level: task.level + 1, xp: newXp - maxXp };
    } else {
      s.jobs[s.player.currentJobId] = { ...task, xp: newXp };
    }
  }

  // Process current skill
  if (s.player.currentSkillId && s.skills[s.player.currentSkillId]) {
    const gain = applySpeed(getSkillXpGain(s, s.player.currentSkillId), s);
    const task = s.skills[s.player.currentSkillId];
    const maxXp = getMaxXp(SKILL_MAP[s.player.currentSkillId]?.maxXp || 100, task.level);
    const newXp = task.xp + gain;
    if (newXp >= maxXp) {
      s.skills[s.player.currentSkillId] = { ...task, level: task.level + 1, xp: newXp - maxXp };
    } else {
      s.skills[s.player.currentSkillId] = { ...task, xp: newXp };
    }
  }

  // Apply income
  const jobIncome = s.player.currentJobId ? applySpeed(getJobIncome(s, s.player.currentJobId), s) : 0;
  const townIncome = applySpeed(calculateTownIncome(s), s);

  // Apply expenses with bargaining/intimidation discount
  const expenseMultiplier = getBargainingEffect(s) * getIntimidationEffect(s);
  const expense = applySpeed(getTotalExpense(s) * expenseMultiplier, s);

  s = {
    ...s,
    player: {
      ...s.player,
      coins: Math.max(0, s.player.coins + Math.round(jobIncome + townIncome - expense)),
      age: Math.min(s.player.age, s.player.lifespan),
    },
  };

  // Bankruptcy check
  if (s.player.coins < 0) {
    s.player.coins = 0;
    s.player.currentPropertyId = 'homeless';
    s.player.currentMiscIds = [];
  }

  return s;
}
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 5: Save System

**Files:**
- Create: `src/engine/save.ts`

**Interfaces:**
- Consumes: `GameState`
- Produces: `saveToStorage`, `loadFromStorage`, `exportSave`, `importSave`

- [ ] **Step 1: Create `src/engine/save.ts`**

```typescript
import { GameState, TaskState, PlayerState, TownBuildingState } from './types';
import { createInitialGameState } from './rebirth';
import { JOBS, JOB_MAP } from './data/jobs';
import { SKILLS, SKILL_MAP } from './data/skills';
import { ITEMS, ITEM_MAP } from './data/items';
import { TOWN_BUILDING_MAP } from './data/townBuildings';

const STORAGE_KEY = 'gameDataSave';

interface LegacySave {
  coins?: number;
  days?: number;
  evil?: number;
  paused?: boolean;
  timeWarpingEnabled?: boolean;
  rebirthOneCount?: number;
  rebirthTwoCount?: number;
  currentJob?: { name?: string };
  currentSkill?: { name?: string };
  currentProperty?: { name?: string };
  currentMisc?: Array<{ name?: string }>;
  taskData?: Record<string, { level?: number; maxLevel?: number; xp?: number }>;
  itemData?: Record<string, any>;
  townData?: Record<string, { count?: number; costOfNextBuilding?: number }>;
  rawTownIncome?: number;
}

function findIdByName(name: string, map: Record<string, { name: string }>): string | null {
  for (const [id, def] of Object.entries(map)) {
    if (def.name === name) return id;
  }
  return null;
}

function migrateLegacySave(raw: any): GameState {
  const state = createInitialGameState();
  const legacy = raw as LegacySave;

  // Player
  if (legacy.coins !== undefined) state.player.coins = legacy.coins;
  if (legacy.days !== undefined) state.player.age = legacy.days;
  if (legacy.evil !== undefined) state.player.evil = legacy.evil;
  if (legacy.paused !== undefined) state.player.paused = legacy.paused;
  if (legacy.timeWarpingEnabled !== undefined) state.player.timeWarp = legacy.timeWarpingEnabled;
  if (legacy.rebirthOneCount !== undefined) state.player.rebirthOneCount = legacy.rebirthOneCount;
  if (legacy.rebirthTwoCount !== undefined) state.player.rebirthTwoCount = legacy.rebirthTwoCount;

  // Current job/skill
  if (legacy.currentJob?.name) {
    const id = findIdByName(legacy.currentJob.name, JOB_MAP);
    if (id) state.player.currentJobId = id;
  }
  if (legacy.currentSkill?.name) {
    const id = findIdByName(legacy.currentSkill.name, SKILL_MAP);
    if (id) state.player.currentSkillId = id;
  }
  if (legacy.currentProperty?.name) {
    const id = findIdByName(legacy.currentProperty.name, ITEM_MAP);
    if (id) state.player.currentPropertyId = id;
  }
  if (legacy.currentMisc) {
    state.player.currentMiscIds = legacy.currentMisc
      .map(m => m.name ? findIdByName(m.name, ITEM_MAP) : null)
      .filter((id): id is string => id !== null);
  }

  // Task data (jobs + skills)
  if (legacy.taskData) {
    for (const [legacyName, taskData] of Object.entries(legacy.taskData)) {
      let id = findIdByName(legacyName, JOB_MAP);
      if (id && state.jobs[id]) {
        if (taskData.level !== undefined) state.jobs[id].level = taskData.level;
        if (taskData.maxLevel !== undefined) state.jobs[id].maxLevel = taskData.maxLevel;
        if (taskData.xp !== undefined) state.jobs[id].xp = taskData.xp;
      }
      id = findIdByName(legacyName, SKILL_MAP);
      if (id && state.skills[id]) {
        if (taskData.level !== undefined) state.skills[id].level = taskData.level;
        if (taskData.maxLevel !== undefined) state.skills[id].maxLevel = taskData.maxLevel;
        if (taskData.xp !== undefined) state.skills[id].xp = taskData.xp;
      }
    }
  }

  // Town data
  if (legacy.townData) {
    for (const [legacyName, townData] of Object.entries(legacy.townData)) {
      const id = findIdByName(legacyName, TOWN_BUILDING_MAP as unknown as Record<string, { name: string }>);
      if (id && state.town[id]) {
        if (townData.count !== undefined) state.town[id].count = townData.count;
        if (townData.costOfNextBuilding !== undefined) state.town[id].costOfNext = townData.costOfNextBuilding;
      }
    }
  }

  return state;
}

export function saveToStorage(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game data:', e);
  }
}

export function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Check save version to detect legacy format
    if (parsed.saveVersion === 2) {
      return parsed as GameState;
    }
    // Legacy migration
    return migrateLegacySave(parsed);
  } catch (e) {
    console.error('Failed to load game data:', e);
    return null;
  }
}

export function exportSave(state: GameState): string {
  try {
    return btoa(JSON.stringify(state));
  } catch (e) {
    return '';
  }
}

export function importSave(data: string): GameState | null {
  try {
    const parsed = JSON.parse(atob(data));
    if (parsed.saveVersion === 2) {
      return parsed as GameState;
    }
    return migrateLegacySave(parsed);
  } catch (e) {
    return null;
  }
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 6: Zustand Store

**Files:**
- Create: `src/store/gameStore.ts`

**Interfaces:**
- Consumes: `GameState`, `gameTick`, `saveToStorage`, `loadFromStorage`, `exportSave`, `importSave`, rebirth functions
- Produces: Zustand store with full state + actions

- [ ] **Step 1: Create `src/store/gameStore.ts`**

```typescript
import { create } from 'zustand';
import { GameState } from '../engine/types';
import { gameTick } from '../engine/game';
import { performRebirthOne, performRebirthTwo, createInitialGameState } from '../engine/rebirth';
import { saveToStorage, loadFromStorage, exportSave, importSave } from '../engine/save';
import { ITEM_MAP } from '../engine/data/items';
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
  const loaded = loadFromStorage();
  return loaded || createInitialGameState();
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  tick: () => {
    const state = get();
    if (state.player.paused) return;
    if (state.player.age >= state.player.lifespan) return;
    const newState = gameTick(state);
    set({ ...newState });
  },

  setJob: (jobId) => set((s) => ({
    player: { ...s.player, currentJobId: jobId },
  })),

  setSkill: (skillId) => set((s) => ({
    player: { ...s.player, currentSkillId: skillId },
  })),

  setProperty: (propertyId) => set((s) => ({
    player: { ...s.player, currentPropertyId: propertyId },
  })),

  toggleMisc: (miscId) => set((s) => {
    const has = s.player.currentMiscIds.includes(miscId);
    return {
      player: {
        ...s.player,
        currentMiscIds: has
          ? s.player.currentMiscIds.filter(id => id !== miscId)
          : [...s.player.currentMiscIds, miscId],
      },
    };
  }),

  togglePause: () => set((s) => ({
    player: { ...s.player, paused: !s.player.paused },
  })),

  toggleAutoPromote: () => set((s) => ({
    player: { ...s.player, autoPromote: !s.player.autoPromote },
  })),

  toggleAutoLearn: () => set((s) => ({
    player: { ...s.player, autoLearn: !s.player.autoLearn },
  })),

  toggleTimeWarp: () => set((s) => ({
    player: { ...s.player, timeWarp: !s.player.timeWarp },
  })),

  purchaseTownBuilding: (buildingId) => set((s) => {
    const building = s.town[buildingId];
    if (!building) return s;
    if (s.player.coins < building.costOfNext) return s;
    return {
      player: { ...s.player, coins: s.player.coins - building.costOfNext },
      town: {
        ...s.town,
        [buildingId]: {
          count: building.count + 1,
          costOfNext: Math.round(building.costOfNext * TOWN_BUILDING_MAP[buildingId]?.costGrowthFactor || 1.01),
        },
      },
    };
  }),

  doRebirthOne: () => set((s) => performRebirthOne(s)),

  doRebirthTwo: () => set((s) => performRebirthTwo(s)),

  importSaveData: (data: string) => {
    const parsed = importSave(data);
    if (parsed) {
      set({ ...parsed });
      saveToStorage(parsed);
      return true;
    }
    return false;
  },

  exportSaveData: () => exportSave(get()),

  resetGame: () => {
    const fresh = createInitialGameState();
    set({ ...fresh });
    localStorage.removeItem('gameDataSave');
  },

  saveGame: () => saveToStorage(get()),
}));
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 7: Web Worker Ticker + Hooks

**Files:**
- Create: `public/ticker.worker.js`
- Create: `src/hooks/useGameLoop.ts`
- Create: `src/hooks/useAutoSave.ts`

**Interfaces:**
- Consumes: `useGameStore`
- Produces: hooks that start/stop the game loop, auto-save

- [ ] **Step 1: Create `public/ticker.worker.js`**

```javascript
setInterval(() => {
  postMessage(null);
}, 50);
```

- [ ] **Step 2: Create `src/hooks/useGameLoop.ts`**

```typescript
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('/ticker.worker.js', import.meta.url));

    workerRef.current.onmessage = () => {
      useGameStore.getState().tick();
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);
}
```

- [ ] **Step 3: Create `src/hooks/useAutoSave.ts`**

```typescript
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useAutoSave(intervalMs = 3000) {
  useEffect(() => {
    const id = setInterval(() => {
      useGameStore.getState().saveGame();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
```

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 8: Common UI Components

**Files:**
- Create: `src/components/common/ProgressBar.tsx`
- Create: `src/components/common/CoinDisplay.tsx`
- Create: `src/components/common/TaskRow.tsx`

**Interfaces:**
- Consumes: store selectors
- Produces: reusable React components

- [ ] **Step 1: Create `src/components/common/ProgressBar.tsx`**

```typescript
interface ProgressBarProps {
  current: number;
  max: number;
  width?: number;
  color?: string;
  className?: string;
}

function ProgressBar({ current, max, width = 200, color = 'rgb(46, 148, 231)', className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  return (
    <div
      className={`progress-bar ${className || ''}`}
      style={{ width }}
    >
      <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default ProgressBar;
```

- [ ] **Step 2: Create `src/components/common/CoinDisplay.tsx`**

```typescript
import { formatCoins, CoinTier } from '../../engine/economy';

interface CoinDisplayProps {
  coins: number;
}

function CoinDisplay({ coins }: CoinDisplayProps) {
  const tiers = formatCoins(coins);
  return (
    <span className="coin-display">
      {tiers.map((tier, i) =>
        tier.value > 0 ? (
          <span key={i} style={{ color: tier.color }}>
            {tier.value}{tier.label}{' '}
          </span>
        ) : null
      )}
    </span>
  );
}

export default CoinDisplay;
```

- [ ] **Step 3: Create `src/components/common/TaskRow.tsx`**

```typescript
import ProgressBar from './ProgressBar';
import CoinDisplay from './CoinDisplay';
import { TaskState } from '../../engine/types';
import { getMaxXp } from '../../engine/time';

interface TaskRowProps {
  name: string;
  task: TaskState;
  baseMaxXp: number;
  income?: number;
  effectDescription?: string;
  xpGain?: number;
  isCurrent: boolean;
  isJob: boolean;
  onClick?: () => void;
  showSkip?: boolean;
  onSkipToggle?: () => void;
}

function TaskRow({ name, task, baseMaxXp, income, effectDescription, xpGain, isCurrent, onClick, showSkip, onSkipToggle }: TaskRowProps) {
  const maxXp = getMaxXp(baseMaxXp, task.level);
  return (
    <tr>
      <td>
        <div className={`progress-bar ${isCurrent ? 'current' : ''}`} onClick={onClick} style={{ cursor: 'pointer' }}>
          <ProgressBar current={task.xp} max={maxXp} color={isCurrent ? 'orange' : undefined} />
          <span className="name">{name}</span>
        </div>
      </td>
      <td>{task.level}</td>
      <td>
        {isJob && income !== undefined ? <CoinDisplay coins={income} /> : effectDescription || ''}
      </td>
      <td>{xpGain !== undefined ? Math.round(xpGain) : '-'}</td>
      <td>{Math.round(maxXp - task.xp)}</td>
      {showSkip && (
        <td>
          <input type="checkbox" onChange={onSkipToggle} />
        </td>
      )}
    </tr>
  );
}

export default TaskRow;
```

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 9: Sidebar Component

**Files:**
- Create: `src/components/Sidebar.tsx`

**Interfaces:**
- Consumes: `useGameStore` selectors
- Produces: sidebar with age, coins, toggles, progress bars

- [ ] **Step 1: Create `src/components/Sidebar.tsx`**

```typescript
import { useGameStore } from '../store/gameStore';
import CoinDisplay from './common/CoinDisplay';
import ProgressBar from './common/ProgressBar';
import { daysToYears } from '../engine/requirements';
import { getJobIncome, getJobXpGain, getSkillXpGain } from '../engine/game';
import { getHappiness, getEvilGain } from '../engine/game';
import { getAllTimeMultipliers } from '../engine/time';
import { calculateTownIncome } from '../engine/town';
import { getTotalExpense } from '../engine/economy';
import { getBargainingEffect, getIntimidationEffect } from '../engine/time';
import { JOB_MAP } from '../engine/data/jobs';
import { SKILL_MAP } from '../engine/data/skills';
import { getMaxXp } from '../engine/time';

function Sidebar() {
  const state = useGameStore();

  const ageYears = daysToYears(state.player.age);
  const day = Math.floor(state.player.age - ageYears * 365);

  const jobIncome = state.player.currentJobId ? getJobIncome(state, state.player.currentJobId) : 0;
  const townIncome = calculateTownIncome(state);
  const totalIncome = jobIncome + townIncome;
  const expenseMult = getBargainingEffect(state) * getIntimidationEffect(state);
  const totalExpense = getTotalExpense(state) * expenseMult;
  const net = Math.abs(totalIncome - totalExpense);

  const happiness = getHappiness(state);
  const evilGain = getEvilGain(state);

  const currentJob = state.player.currentJobId ? state.jobs[state.player.currentJobId] : null;
  const currentSkill = state.player.currentSkillId ? state.skills[state.player.currentSkillId] : null;

  return (
    <div className="sidebar">
      {state.player.age >= state.player.lifespan && (
        <div className="death-text">
          <div style={{ fontSize: 'large', color: 'red' }}>Age has caught up to you</div>
          <div className="sidebar-element" style={{ color: 'gray' }}>Use the amulet to rebirth</div>
        </div>
      )}

      <div style={{ fontSize: 'large' }}>
        Age {ageYears} Day {day}
      </div>
      <div className="sidebar-element" style={{ color: 'gray' }}>
        Lifespan: {daysToYears(state.player.lifespan)} years
      </div>

      <button className="button sidebar-element" onClick={() => useGameStore.getState().togglePause()}>
        {state.player.paused ? 'Play' : 'Pause'}
      </button>

      <div className="sidebar-element">
        <div className="inline">Auto-promote</div>
        <input type="checkbox" checked={state.player.autoPromote} onChange={() => useGameStore.getState().toggleAutoPromote()} />
      </div>
      <div className="sidebar-element">
        <div className="inline">Auto-learn</div>
        <input type="checkbox" checked={state.player.autoLearn} onChange={() => useGameStore.getState().toggleAutoLearn()} />
      </div>

      <div style={{ fontSize: 'large' }}>
        <CoinDisplay coins={state.player.coins} />
      </div>
      <div className="sidebar-element" style={{ color: 'gray' }}>Balance (in coins)</div>

      <ul className="sidebar-element">
        <li>
          <span style={{ color: 'rgb(9, 160, 230)' }}>Net/day: </span>
          <span style={{ color: totalIncome > totalExpense ? 'green' : 'red' }}>
            {totalIncome > totalExpense ? '+' : '-'}
          </span>
          <CoinDisplay coins={net} />
        </li>
        <li>
          <span style={{ color: 'green' }}>Income/day: </span>
          <CoinDisplay coins={totalIncome} />
        </li>
        <li>
          <span style={{ color: 'red' }}>Expense/day: </span>
          <CoinDisplay coins={totalExpense} />
        </li>
      </ul>

      {currentJob && state.player.currentJobId && (
        <div className="sidebar-element">
          <ProgressBar
            current={currentJob.xp}
            max={getMaxXp(JOB_MAP[state.player.currentJobId]?.maxXp || 50, currentJob.level)}
            width={230}
            color="rgb(225, 165, 0)"
          />
          <div style={{ color: 'gray' }}>Current job</div>
        </div>
      )}

      {currentSkill && state.player.currentSkillId && (
        <div className="sidebar-element">
          <ProgressBar
            current={currentSkill.xp}
            max={getMaxXp(SKILL_MAP[state.player.currentSkillId]?.maxXp || 100, currentSkill.level)}
            width={230}
            color="rgb(225, 165, 0)"
          />
          <div style={{ color: 'gray' }}>Current skill</div>
        </div>
      )}

      <div style={{ fontSize: 'large' }}>
        <span style={{ color: 'rgb(15, 105, 207)' }}>Happiness: </span>
        {happiness.toFixed(1)}
      </div>

      {state.player.evil > 0 && (
        <div>
          <div style={{ fontSize: 'large' }}>
            <span style={{ color: 'rgb(200, 0, 0)' }}>Evil: </span>
            {state.player.evil.toFixed(1)}
          </div>
        </div>
      )}

      <div className="sidebar-element">
        <div style={{ fontSize: 'large' }}>
          <span style={{ color: 'rgb(204, 34, 219)' }}>Time warping: </span>
          x{getAllTimeMultipliers(state).toFixed(2)}
        </div>
        <button className="button sidebar-element" onClick={() => useGameStore.getState().toggleTimeWarp()}>
          {state.player.timeWarp ? 'Disable warp' : 'Enable warp'}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 10: Tab Views

**Files:**
- Create: `src/components/GameTabs.tsx`
- Create: `src/components/tabs/JobsTab.tsx`
- Create: `src/components/tabs/SkillsTab.tsx`
- Create: `src/components/tabs/ShopTab.tsx`
- Create: `src/components/tabs/TownTab.tsx`
- Create: `src/components/tabs/AmuletTab.tsx`
- Create: `src/components/tabs/SettingsTab.tsx`

**Interfaces:**
- Consumes: `useGameStore` selectors, common components
- Produces: all 6 tab views

- [ ] **Step 1: Create `src/components/tabs/JobsTab.tsx`**

```typescript
import { useGameStore } from '../../store/gameStore';
import { JOBS, JOB_MAP } from '../../engine/data/jobs';
import { JOB_CATEGORIES } from '../../engine/data/categories';
import { HEADER_ROW_COLORS } from '../../engine/data/headerRowColors';
import TaskRow from '../common/TaskRow';
import { getJobXpGain, getJobIncome } from '../../engine/game';

function JobsTab() {
  const state = useGameStore();

  return (
    <table className="w3-table w3-bordered">
      {JOB_CATEGORIES.map(category => {
        const categoryJobs = JOBS.filter(j => j.category === category);
        return (
          <tbody key={category}>
            <tr style={{ backgroundColor: HEADER_ROW_COLORS[category], color: 'white' }}>
              <th style={{ width: 250 }}>{category}</th>
              <th>Level</th>
              <th>Income/day</th>
              <th>Xp/day</th>
              <th>Xp left</th>
            </tr>
            {categoryJobs.map(jobDef => {
              const task = state.jobs[jobDef.id];
              if (!task) return null;
              return (
                <TaskRow
                  key={jobDef.id}
                  name={jobDef.name}
                  task={task}
                  baseMaxXp={jobDef.maxXp}
                  income={getJobIncome(state, jobDef.id)}
                  xpGain={getJobXpGain(state, jobDef.id)}
                  isCurrent={state.player.currentJobId === jobDef.id}
                  isJob={true}
                  onClick={() => useGameStore.getState().setJob(jobDef.id)}
                />
              );
            })}
          </tbody>
        );
      })}
    </table>
  );
}

export default JobsTab;
```

- [ ] **Step 2: Create `src/components/tabs/SkillsTab.tsx`**

```typescript
import { useGameStore } from '../../store/gameStore';
import { SKILLS, SKILL_MAP } from '../../engine/data/skills';
import { SKILL_CATEGORIES } from '../../engine/data/categories';
import { HEADER_ROW_COLORS } from '../../engine/data/headerRowColors';
import TaskRow from '../common/TaskRow';
import { getSkillXpGain } from '../../engine/game';

function SkillsTab() {
  const state = useGameStore();

  return (
    <table className="w3-table w3-bordered">
      {SKILL_CATEGORIES.map(category => {
        const categorySkills = SKILLS.filter(s => s.category === category);
        return (
          <tbody key={category}>
            <tr style={{ backgroundColor: HEADER_ROW_COLORS[category], color: 'white' }}>
              <th style={{ width: 250 }}>{category}</th>
              <th>Level</th>
              <th>Effect</th>
              <th>Xp/day</th>
              <th>Xp left</th>
            </tr>
            {categorySkills.map(skillDef => {
              const task = state.skills[skillDef.id];
              if (!task) return null;
              const effect = 1 + task.level * skillDef.effect;
              return (
                <TaskRow
                  key={skillDef.id}
                  name={skillDef.name}
                  task={task}
                  baseMaxXp={skillDef.maxXp}
                  effectDescription={`x${effect.toFixed(2)} ${skillDef.description}`}
                  xpGain={getSkillXpGain(state, skillDef.id)}
                  isCurrent={state.player.currentSkillId === skillDef.id}
                  isJob={false}
                  onClick={() => useGameStore.getState().setSkill(skillDef.id)}
                />
              );
            })}
          </tbody>
        );
      })}
    </table>
  );
}

export default SkillsTab;
```

- [ ] **Step 3: Create `src/components/tabs/ShopTab.tsx`**

```typescript
import { useGameStore } from '../../store/gameStore';
import { ITEMS, ITEM_MAP } from '../../engine/data/items';
import CoinDisplay from '../common/CoinDisplay';

function ShopTab() {
  const state = useGameStore();

  const properties = ITEMS.filter(i => i.category === 'Property');
  const misc = ITEMS.filter(i => i.category === 'Misc');

  return (
    <table className="w3-table w3-bordered">
      <thead>
        <tr style={{ backgroundColor: '#219ebc', color: 'white' }}>
          <th style={{ width: 250 }}>Properties</th>
          <th style={{ width: 100 }}>Active</th>
          <th style={{ width: 250 }}>Effect</th>
          <th>Expense/day</th>
        </tr>
      </thead>
      <tbody>
        {properties.map(item => {
          const isActive = state.player.currentPropertyId === item.id;
          return (
            <tr key={item.id}>
              <td>
                <button className="item-button" onClick={() => useGameStore.getState().setProperty(item.id)}>
                  {item.name}
                </button>
              </td>
              <td>
                <div className="active-indicator" style={{
                  width: 24, height: 24, borderRadius: '50%',
                  backgroundColor: isActive ? '#219ebc' : 'white',
                  border: '1px solid black',
                }} />
              </td>
              <td>{`x${item.effect.toFixed(1)} Happiness`}</td>
              <td><CoinDisplay coins={item.expense} /></td>
            </tr>
          );
        })}
      </tbody>

      <thead>
        <tr style={{ backgroundColor: '#b56576', color: 'white' }}>
          <th style={{ width: 250 }}>Misc</th>
          <th style={{ width: 100 }}>Active</th>
          <th style={{ width: 250 }}>Effect</th>
          <th>Expense/day</th>
        </tr>
      </thead>
      <tbody>
        {misc.map(item => {
          const isActive = state.player.currentMiscIds.includes(item.id);
          return (
            <tr key={item.id}>
              <td>
                <button className="item-button" onClick={() => useGameStore.getState().toggleMisc(item.id)}>
                  {item.name}
                </button>
              </td>
              <td>
                <div className="active-indicator" style={{
                  width: 24, height: 24, borderRadius: '50%',
                  backgroundColor: isActive ? '#b56576' : 'white',
                  border: '1px solid black',
                }} />
              </td>
              <td>{item.description ? `x${item.effect.toFixed(1)} ${item.description}` : ''}</td>
              <td><CoinDisplay coins={item.expense} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ShopTab;
```

- [ ] **Step 4: Create `src/components/tabs/TownTab.tsx`**

```typescript
import { useGameStore } from '../../store/gameStore';
import { TOWN_BUILDINGS, TOWN_BUILDING_MAP } from '../../engine/data/townBuildings';
import CoinDisplay from '../common/CoinDisplay';
import { calculateTownIncome } from '../../engine/town';

function TownTab() {
  const state = useGameStore();
  const townIncome = calculateTownIncome(state);

  return (
    <div>
      <h4>Town</h4>
      <p>Town Income per day: <CoinDisplay coins={townIncome} /></p>
      <hr />
      <h5>Basic Buildings</h5>
      <div className="w3-row">
        {TOWN_BUILDINGS.map(building => {
          const bState = state.town[building.id];
          if (!bState) return null;
          return (
            <button
              key={building.id}
              className="town-building-button"
              onClick={() => useGameStore.getState().purchaseTownBuilding(building.id)}
              disabled={state.player.coins < bState.costOfNext}
            >
              {building.name}
              <span className="badge">{bState.count}</span>
              <div className="tooltip-text">
                Cost: <CoinDisplay coins={bState.costOfNext} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TownTab;
```

- [ ] **Step 5: Create `src/components/tabs/AmuletTab.tsx`**

```typescript
import { useGameStore } from '../../store/gameStore';
import { daysToYears } from '../../engine/requirements';
import { getEvilGain } from '../../engine/game';

function AmuletTab() {
  const state = useGameStore();
  const ageYears = daysToYears(state.player.age);
  const evilGain = getEvilGain(state);

  return (
    <ul>
      <li style={{ margin: 8 }}>
        You stumble across a strange looking amulet on your 25th birthday...
      </li>
      {ageYears >= 45 && (
        <li style={{ margin: 8 }}>
          On your 45th birthday, you feel the amulet shiver uncontrollably...
        </li>
      )}
      {ageYears >= 65 && (
        <li style={{ margin: 8 }}>
          <div style={{ marginBottom: 8 }}>
            On your 65th birthday, you once again encounter the strange shivering...
          </div>
          <i style={{ color: 'grey' }}>
            By touching the eyeball, you will be reborn... gain xp multipliers...
          </i>
          <br />
          <button className="button" onClick={() => useGameStore.getState().doRebirthOne()}>
            Touch the eye
          </button>
        </li>
      )}
      {ageYears >= 200 && (
        <li style={{ margin: 8 }}>
          <div style={{ marginBottom: 8 }}>
            The moment you hit the grand age of 200, you hear an ominous hum...
          </div>
          <i style={{ color: 'rgb(200, 0, 0)' }}>
            Embrace evil — reset everything and gain {evilGain.toFixed(1)} evil.
          </i>
          <br />
          <button className="button" onClick={() => useGameStore.getState().doRebirthTwo()}>
            Embrace evil
          </button>
        </li>
      )}
    </ul>
  );
}

export default AmuletTab;
```

- [ ] **Step 6: Create `src/components/tabs/SettingsTab.tsx`**

```typescript
import { useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

function SettingsTab() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = useGameStore.getState().exportSaveData();
    if (inputRef.current) inputRef.current.value = data;
  };

  const handleImport = () => {
    const data = inputRef.current?.value;
    if (!data) return;
    const success = useGameStore.getState().importSaveData(data);
    if (success) alert('Save imported successfully!');
    else alert('Invalid save data.');
  };

  const toggleTheme = () => {
    document.getElementById('body')?.classList.toggle('dark');
  };

  return (
    <ul>
      <li>
        <h2>Import/export save</h2>
        <button className="button" onClick={handleImport}>Import</button>
        <button className="button" onClick={handleExport}>Export</button>
        <form style={{ marginTop: 16 }}>
          <input ref={inputRef} type="text" style={{ width: 300, height: 30 }} />
        </form>
      </li>
      <li>
        <h2>Toggle light/dark mode</h2>
        <button className="button" onClick={toggleTheme}>Toggle</button>
      </li>
      <li>
        <h2>Hard reset game</h2>
        <button className="button w3-red" onClick={() => {
          if (confirm('Are you sure you want to reset your game?')) {
            useGameStore.getState().resetGame();
          }
        }}>Reset</button>
      </li>
    </ul>
  );
}

export default SettingsTab;
```

- [ ] **Step 7: Create `src/components/GameTabs.tsx`** (updated version)

```typescript
import { useState } from 'react';
import JobsTab from './tabs/JobsTab';
import SkillsTab from './tabs/SkillsTab';
import ShopTab from './tabs/ShopTab';
import TownTab from './tabs/TownTab';
import AmuletTab from './tabs/AmuletTab';
import SettingsTab from './tabs/SettingsTab';

const TABS = [
  { id: 'jobs', label: 'Jobs', component: JobsTab },
  { id: 'skills', label: 'Skills', component: SkillsTab },
  { id: 'shop', label: 'Shop', component: ShopTab },
  { id: 'town', label: 'Town', component: TownTab },
  { id: 'rebirth', label: 'Amulet', component: AmuletTab },
  { id: 'settings', label: 'Settings', component: SettingsTab },
] as const;

function GameTabs() {
  const [activeTab, setActiveTab] = useState('jobs');
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || JobsTab;

  return (
    <div className="tab-container">
      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default GameTabs;
```

- [ ] **Step 8: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 11: App Shell Assembly

**Files:**
- Modify: `src/components/App.tsx`

- [ ] **Step 1: Update `src/components/App.tsx`**

```typescript
import Sidebar from './Sidebar';
import GameTabs from './GameTabs';
import { useGameLoop } from '../hooks/useGameLoop';
import { useAutoSave } from '../hooks/useAutoSave';

function App() {
  useGameLoop();
  useAutoSave(3000);

  return (
    <div className="app-container">
      <h1>Progress Knight - Reborn</h1>
      <div className="main-layout">
        <Sidebar />
        <GameTabs />
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`

---

### Task 12: Styles

**Files:**
- Create: `src/styles/main.css`
- Modify: `src/styles/main.css` (final version)

- [ ] **Step 1: Create `src/styles/main.css`**

Migrate from `css/styles.css` and `css/dark.css`, plus new component styles:

```css
:root {
  --bg-color: rgb(243, 243, 243);
  --panel-bg: white;
  --text-color: black;
  --border-color: black;
}

[data-theme="dark"],
body.dark {
  --bg-color: #1a1a2e;
  --panel-bg: #16213e;
  --text-color: #e0e0e0;
  --border-color: #444;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 16px;
}

.app-container {
  max-width: 1240px;
  margin: 0 auto;
}

.main-layout {
  display: flex;
  gap: 16px;
}

.sidebar {
  width: 300px;
  padding: 16px;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-color);
}

.tab-container {
  flex: 1;
}

.tab-bar {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
}

.tab-button {
  width: 100px;
  height: 40px;
  text-align: center;
  border: 1px solid var(--border-color);
  background-color: var(--panel-bg);
  cursor: pointer;
}

.tab-button.active {
  background-color: #607d8b;
  color: white;
}

.tab-content {
  padding: 16px;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-color);
}

.progress-bar {
  position: relative;
  background-color: rgb(12, 101, 173);
  cursor: pointer;
  width: 200px;
  height: 30px;
}

.progress-fill {
  height: 30px;
  background-color: rgb(46, 148, 231);
  transition: width 0.1s;
}

.progress-bar.current .progress-fill {
  background-color: orange;
}

.name {
  position: absolute;
  top: 0;
  padding: 5px;
  color: white;
  font-size: 14px;
}

td {
  vertical-align: middle !important;
}

.button {
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  cursor: pointer;
  background-color: var(--panel-bg);
}

.item-button {
  background-color: white;
  text-align: center;
  width: 200px;
  height: 40px;
  padding: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
}

.item-button:hover {
  background-color: rgb(192, 192, 192);
}

.sidebar-element {
  margin-bottom: 16px;
}

.inline {
  display: inline-block;
}

.coin-display span {
  margin-right: 2px;
}

.hidden {
  display: none !important;
}

.town-building-button {
  background-color: black;
  color: white;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
  position: relative;
}

.town-building-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.badge {
  background-color: white;
  color: black;
  border-radius: 50%;
  padding: 2px 6px;
  margin-left: 8px;
}

.tooltip-text {
  display: none;
}

.town-building-button:hover .tooltip-text {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: black;
  color: white;
  padding: 8px;
  border-radius: 4px;
  z-index: 100;
  width: 200px;
}

.active-indicator {
  display: inline-block;
}

.w3-table {
  width: 100%;
  border-collapse: collapse;
}

.w3-table th, .w3-table td {
  padding: 8px;
  text-align: left;
}

.w3-table th {
  font-weight: bold;
}

.w3-bordered th, .w3-bordered td {
  border-bottom: 1px solid #ddd;
}

.w3-red {
  background-color: #f44336 !important;
  color: white !important;
}

.death-text {
  margin-bottom: 16px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 8px 0;
}
```

- [ ] **Step 2: Verify compilation and build**

Run: `npx tsc --noEmit`
Run: `npm run build`

---

### Task 13: Final Integration and Cleanup

**Files:**
- Remove: `css/styles.css`, `css/dark.css`
- Remove: `js/` directory (all files)
- Remove: old `index.html` (already replaced in Task 1)

- [ ] **Step 1: Run final build to verify everything compiles**

```bash
npm run build
```

- [ ] **Step 2: Start dev server and manually verify all tabs render correctly**

```bash
npm run dev
```

Open browser to the displayed URL. Verify:
- Sidebar shows age, coins, toggles, progress bars
- Jobs tab lists all jobs, clicking selects one
- Skills tab lists all skills, clicking selects one
- Shop tab shows properties and misc items, clicking toggles active
- Town tab shows buildings, clicking purchases one
- Amulet tab shows rebirth options based on age
- Settings tab: import/export, theme toggle, reset
- Dark mode toggle works
- Game loop runs (age advances, coins increase)
- Save/load works (refresh preserves state)

- [ ] **Step 3: Remove old files**

```bash
Remove-Item -Recurse -Force css
Remove-Item -Recurse -Force js
Remove-Item -Force documentation/tooltip-architecture.md
```

Note: Keep `README.md`, `.git/`, and `docs/` directory.

- [ ] **Step 4: Final build test**

```bash
npm run build
```
