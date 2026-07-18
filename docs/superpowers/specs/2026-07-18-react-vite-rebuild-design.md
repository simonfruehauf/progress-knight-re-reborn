# Progress Knight — React/Vite Rebuild Design

**Date:** 2026-07-18
**Status:** Approved design, awaiting implementation plan

## 1. Motivation

Rebuild Progress Knight - Reborn from vanilla JavaScript (script-tag era) to a modern React + TypeScript + Vite stack. Primary goal: **maintainability and code organization** — clean separation of game logic from UI, type safety, and a modular architecture that makes future features easy to add.

## 2. Architecture

Two independent layers connected by a Zustand store.

```
Game Loop (50fps, Web Worker ticker)
         │
         ▼
  Engine Layer (pure TS, no React)
  ┌──────────────────────────────┐
  │  types.ts ── data/*.ts       │
  │  game.ts (tick function)     │
  │  requirements.ts             │
  │  rebirth.ts                  │
  │  economy.ts                  │
  │  town.ts                     │
  │  save.ts                     │
  │  time.ts                     │
  └──────────────┬───────────────┘
         │
         ▼
  Zustand Store (gameStore.ts)
         │
         ▼
  UI Layer (React components)
  ┌──────────────────────────────┐
  │  App → Sidebar + GameTabs    │
  │  tabs: Jobs, Skills, Shop,   │
  │        Town, Amulet, Settings │
  └──────────────────────────────┘
```

### 2.1 Data Flow

1. `useGameLoop` hook starts a Web Worker that posts messages at 50ms intervals
2. Each tick calls `engine.gameTick(currentState)` — a pure function returning new state
3. Result is pushed into the Zustand store via `setState`
4. Components using Zustand selectors re-render only when their subscribed slice changes

### 2.2 Key Decisions

- **Zustand** over React Context for state management (minimal boilerplate, selector-based subscriptions, no provider wrapping)
- **Web Worker ticker** replaces HackTimer.js — avoids browser `setInterval` throttling without monkey-patching
- **Plain CSS with custom properties** replaces W3.CSS — removes CDN dependency, dark mode via `data-theme` attribute
- **Game state is a single serializable object** — enables trivial save/load, time-travel debugging, and snapshot testing

## 3. Engine Layer (`src/engine/`)

Pure TypeScript with zero React imports. Every module exports only pure functions and type definitions.

### 3.1 `types.ts`

Core types shared across the engine:

```typescript
interface PlayerState {
  age: number;
  day: number;
  lifespan: number;
  coins: number;
  happiness: number;
  evil: number;
  currentJobId: string | null;
  currentSkillId: string | null;
  paused: boolean;
  autoPromote: boolean;
  autoLearn: boolean;
  timeWarp: boolean;
  rebirthCount: number;
  evilEmbraced: boolean;
}

interface TaskState {
  id: string;
  level: number;
  xp: number;
  maxXp: number;
  unlocked: boolean;
}

interface GameState {
  player: PlayerState;
  jobs: Record<string, TaskState>;
  skills: Record<string, TaskState>;
  inventory: { properties: string[]; misc: string[] };
  town: { buildings: Record<string, number> };
}
```

### 3.2 `data/` — Static Game Data

- `jobs.ts` — 30 job definitions across 5 categories (Common Work, Military, Arcane Association, Order of Discovery, Nobility)
- `skills.ts` — 25 skill definitions across 5 trees (Fundamentals, Combat, Magic, Mind, Dark Magic)
- `items.ts` — 9 properties + 19 misc items
- `categories.ts` — Category groupings with display metadata
- `townBuildings.ts` — Town building definitions with cost/income curves

All data is typed constants. No logic, no state.

### 3.3 `game.ts` — Game Loop Tick

Single export: `gameTick(state: GameState): GameState`

Execution order per tick:
1. `advanceDay(state)` — increment age/day, check lifespan
2. `applyAutoPromote(state)` — promote current job if eligible
3. `applyAutoLearn(state)` — switch to lowest-maxXp unlocked skill
4. `processJob(state)` — add job XP based on level, check level-up
5. `processSkill(state)` — add skill XP based on level, check level-up
6. `applyExpenses(state)` — subtract daily expenses based on properties
7. Return new state object (immutable update pattern)

### 3.4 `requirements.ts`

```typescript
function checkRequirements(state: GameState, requirements: Requirement[]): boolean
```

Supports: `TaskRequirement` (job/skill level gates), `CoinRequirement`, `AgeRequirement`, `EvilRequirement`. Used for unlocking jobs, skills, and items.

### 3.5 `rebirth.ts`

- `performRebirth(state: GameState): GameState` — Tier 1 reset: reset jobs/skills, apply XP multipliers
- `performEmbraceEvil(state: GameState): GameState` — Tier 2 reset: harder reset, unlock Dark Magic, track evil

### 3.6 `economy.ts`

Coin formatting (platinum/gold/silver/copper display), income/expense calculations, item purchase validation.

### 3.7 `town.ts`

Town income calculation, building purchase/destruction logic (buildings destroyed on Embrace Evil).

### 3.8 `save.ts`

- `saveToStorage(state)` — serialize to JSON, write to `localStorage`
- `loadFromStorage(): GameState | null` — read from `localStorage`, handle migration from old save format
- `exportSave(state): string` — base64-encoded JSON string
- `importSave(data: string): GameState` — parse and validate imported save

### 3.9 `time.ts`

Time warping logic — accelerated XP/income multiplier when time warp is active.

## 4. UI Layer (`src/`)

### 4.1 Store (`src/store/gameStore.ts`)

```typescript
interface GameActions {
  tick: () => void;           // Run one game frame
  setJob: (id: string) => void;
  setSkill: (id: string) => void;
  togglePause: () => void;
  toggleAutoPromote: () => void;
  toggleAutoLearn: () => void;
  toggleTimeWarp: () => void;
  purchaseItem: (id: string) => void;
  activateItem: (id: string) => void;
  purchaseTownBuilding: (id: string) => void;
  performRebirth: () => void;
  performEmbraceEvil: () => void;
  importSave: (data: string) => void;
  exportSave: () => string;
  resetGame: () => void;
}

const useGameStore = create<GameState & GameActions>()((set, get) => ({...}));
```

### 4.2 Component Tree

```
<App>
  <Sidebar>
    Age / Day / Lifespan display
    Pause/Play button
    Auto-promote / Auto-learn toggles
    Coin display (formatted)
    Net / Income / Expense per day
    Current job & skill progress bars
    Happiness indicator
    Evil indicator (after Embrace Evil)
    Time Warp toggle
  </Sidebar>
  <GameTabs>
    <TabBar />                         — Tab navigation buttons
    <TabContent>
      <JobsTab>                        — 5 job categories with TaskRow lists
      <SkillsTab>                      — 5 skill categories with TaskRow lists
      <ShopTab>                        — Properties section + Misc section
      <TownTab>                        — Town building cards
      <AmuletTab>                      — Rebirth story + two buttons
      <SettingsTab>                    — Import/export, theme toggle, reset
    </TabContent>
  </GameTabs>
</App>
```

### 4.3 Common Components

- `TaskRow` — renders an entity row: name, level, progress bar, XP text. Used by both JobsTab and SkillsTab.
- `ProgressBar` — renderless utility: `(current, max, width?) => JSX`. Used inside TaskRow, sidebar, etc.
- `CoinDisplay` — takes a raw coin number, formats to platinum/gold/silver/copper with icons.
- `ItemCard` — renders a shop item with name, description, cost, active/inactive state.

### 4.4 Hooks

- `useGameLoop(intervalMs: number)` — manages Web Worker ticker lifecycle. Starts on mount, stops on unmount. Respects `paused` flag.
- `useAutoSave(intervalMs: number)` — calls `saveToStorage` periodically.

## 5. Game Loop & Timing

### 5.1 Web Worker Ticker

Instead of HackTimer.js (which monkey-patches global timer functions), a dedicated Web Worker:

```typescript
// ticker.worker.ts
setInterval(() => postMessage(null), 50);
```

The `useGameLoop` hook creates this worker, listens for messages, and calls `useGameStore.getState().tick()` each time. This naturally avoids browser throttling of background tabs because Web Workers are not subject to the same throttling as `setInterval` on the main thread.

### 5.2 Update Speed

The existing game runs at 50fps (`updateSpeed = 20`, interval = 1000/20 = 50ms → effectively 20 calls per second). Wait — re-examining the original code:

```javascript
setInterval(update, 1000 / updateSpeed);  // updateSpeed = 20 → 50ms interval
```

So it runs every 50ms (20 times/second), not 50fps. Each tick increments the day by `updateSpeed * daysPerTick`. The worker interval will match this: 50ms.

## 6. Save Migration

The existing save format is a JSON object stored under `localStorage` key `ProgressKnightSave`:

```json
{
  "coins": 0,
  "currentJob": "beggar",
  "currentSkill": "mentalStrength",
  ...
}
```

On first load, `loadFromStorage` detects the old format by checking for the absence of a `version` field, runs a migration function to map old field names to new GameState shape, and stores the migrated version. Subsequent saves write the new format with a `version` field.

## 7. Styling

- Drop W3.CSS dependency entirely
- Base layout: CSS Grid (sidebar + main content)
- Dark mode: CSS custom properties on `:root`, overridden under `[data-theme="dark"]`
- Keep the existing color scheme and layout — the rebuild should look identical to the current game visually
- No CSS framework — just plain CSS organized by component

## 8. Excluded from Initial Rebuild

- Testing infrastructure (Vitest, React Testing Library) — deferred
- Google Analytics — removed (was in the original HTML head)
- HackTimer.js — replaced by Web Worker approach
- W3.CSS CDN — replaced by custom CSS
- No new features — this is a faithful rebuild preserving all existing game mechanics

## 9. Out of Scope

This design covers only the React/Vite rebuild with the existing feature set. Future features (new jobs, skills, town expansions, achievements) are deferred to subsequent cycles.
