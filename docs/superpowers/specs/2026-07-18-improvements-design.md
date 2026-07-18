# Progress Knight — Improvements & Features Design

**Date:** 2026-07-18
**Status:** Approved design, awaiting implementation

## 1. Motivation

Address critical quality gaps identified in the rebuild audit: no test coverage, performance issues from full-store subscriptions and deep-clone ticks, missing developer tooling, and several UX polish gaps. Additionally, add Achievements + Statistics features to provide satisfying long-term progression tracking.

## 2. Phase 1 — Developer Infrastructure

### 2.1 Testing (Vitest)

Add `vitest` as dev dependency. Write unit tests for all pure engine functions in:

- `src/engine/game.ts` — `getHappiness`, `getEvilGain`, `getJobXpGain`, `getSkillXpGain`, `getJobIncome`, `increaseDays`, `gameTick`
- `src/engine/economy.ts` — `formatNumber`, `formatCoins`, `getTotalExpense`
- `src/engine/rebirth.ts` — `createInitialGameState`, `performRebirthOne`, `performRebirthTwo`
- `src/engine/town.ts` — `calculateTownIncome`
- `src/engine/time.ts` — all effect functions
- `src/engine/save.ts` — `migrateLegacySave`

No React component tests — engine purity means the critical logic is fully covered without DOM.

### 2.2 Linting & Formatting

Add `eslint` + `prettier` + `eslint-plugin-react-hooks`. Scripts: `lint`, `format`, `lint:fix`.

### 2.3 Error Boundary

Add `ErrorBoundary` React component wrapping `<App>` in `main.tsx`. Shows a "Something went wrong" fallback with a reload button. Catches render-phase crashes gracefully.

## 3. Phase 2 — Performance

### 3.1 Zustand Selectors

Replace all `useGameStore()` (full state subscription) with granular selectors:

| Component | Current | Fix |
|---|---|---|
| `Sidebar` | `const state = useGameStore()` | Select only what it displays: `age`, `coins`, `currentJobId`, `currentSkillId`, specific task states |
| `JobsTab` | `const state = useGameStore()` | Select only `jobs`, `player.currentJobId` |
| `SkillsTab` | Same pattern | Same fix |
| `ShopTab` | Same pattern | Same fix |
| `TownTab` | Same pattern | Same fix |
| `GameTabs` | `const state = useGameStore()` | Select only `age`, `coins` for tab visibility |

This ensures components re-render only when their specific data changes, not every 50ms.

### 3.2 structuredClone

Replace `JSON.parse(JSON.stringify(state))` in `game.ts:increaseDays` and `rebirth.ts:performRebirthOne/Two` with `structuredClone(state)` — faster, preserves more types, native API.

## 4. Phase 3 — Polish

### 4.1 Dark Theme Persistence

Save dark mode preference to `localStorage` key `darkMode`. Check on load and apply before render. Toggle in `SettingsTab` writes to both `localStorage` and body class.

### 4.2 Save/Load User Feedback

- `importSaveData`: return error strings instead of boolean, display in textarea border/color feedback
- `saveToStorage`: silently catches — no change needed (it's an autosave, shouldn't spam). But export/import should surface errors clearly.

### 4.3 README Rewrite

Replace 558-line dev diary with proper project documentation: description, how to run, tech stack, how to build, how to contribute.

### 4.4 Number Format Extension

`formatNumber` currently caps at "Oc" (10^27). Replace static array with dynamic suffix generation: iterate with while-loop generating suffixes on-the-fly (a, b, c, ... aa, ab, ... or use standard metric suffix array extended to arbitrary length). Or use the standard extended SI suffixes up to a reasonable limit (~Vg = 10^33) and generate beyond with concatenations.

### 4.5 CSS Organization

Split `main.css` (364 lines) into component-level files under `src/styles/`:
- `reset.css` — box-sizing, html/body defaults
- `layout.css` — app-container, main-layout, sidebar, tab-container
- `sidebar.css`
- `tabs.css` — tables, buttons, progress bars shared across tabs
- `theme.css` — dark mode overrides
- `utilities.css` — small reusable classes

Each component imports only its styles. Removes dead classes (`.hidden`, `.hiddenTask`, `.scroll`, `.sidebar-element`, `.inline`).

### 4.6 Vite Worker

Move `public/ticker.worker.js` to `src/workers/ticker.ts` (TypeScript) and import via `new Worker(new URL('./workers/ticker.ts', import.meta.url), { type: 'module' })`. Worker gets type-checked and bundled by Vite.

## 5. Phase 4 — Features

### 5.1 Achievements System

**Data model:**

```typescript
interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;            // emoji or text
  check: (state: GameState) => boolean;
  bonus: { type: 'xpMultiplier' | 'incomeMultiplier' | 'happinessMultiplier' | 'evilMultiplier'; value: number };
}
```

Achievements are checked every tick inside `gameTick` and stored as `achievements: Record<string, number>` (id → earned timestamp). Bonuses apply multiplicatively and persist across rebirths.

**Achievements list (~35):**

Early (easy, tutorial-ish):
- First Steps — Reach level 5 in Beggar
- Career Path — Auto-promote for the first time
- Well Read — Buy the Book item
- Property Owner — Buy a property
- Twenty Something — Reach age 20 at least once
- Skill Seeker — Reach level 10 in any skill
- Jack of All Trades — Unlock all Common Work jobs
- Town Founder — Buy your first town building
- Self Improvement — Reach level 50 in Concentration

Mid:
- Military Might — Reach Knight
- War Master — Max all Military jobs
- Arcane Scholar — Reach Mage
- Master of Magic — Max all Magic skills
- Mind Over Matter — Unlock all Mind skills
- Discovery — Reach Senior
- Full Discovery — Max all Order jobs
- Nobility — Become a Count
- Royal Blood — Max all Nobility jobs
- Chairman — Reach Chairman
- Illustrious — Reach Illustrious Chairman
- Immortal — Unlock Super Immortality
- Rebirth — Perform your first Rebirth One
- Touch the Eye — Reach age 65
- Time Traveler — Use Time Warp
- Evil Awakening — Perform Rebirth Two
- Min/Maxer — Max all skills
- Completionist — Max all jobs

Hard:
- Eternal — Reach lifespan of 500+ years
- Millionaire — Have 1M coins at once
- Billionaire — Have 1B coins at once
- Centurion — Reach level 100 in any skill
- Town Tycoon — Buy 50 town buildings
- Full Evil — Collect 100+ evil
- Speed Demon — Reach 100x game speed

**Bonus structure:** Each achievement gives a small permanent bonus (0.5%-5% depending on difficulty):
- xpMultiplier: stacks additively within category, multiplicatively with other bonuses
- Bonuses are tracked as a single `achievementBonus` object in PlayerState

**UI:** New "Achievements" tab showing grid of achievements with earned/unearned state, progress hover, and running total of bonuses active.

### 5.2 Statistics Page

**Data model — add to PlayerState:**

```typescript
interface Statistics {
  totalCoinsEarned: number;
  totalXpEarnedByJob: Record<string, number>;
  totalXpEarnedBySkill: Record<string, number>;
  timePlayedMs: number;
  rebirthCount: number;
  rebirthTwoCount: number;
  totalTownBuildingsPurchased: number;
  totalItemsPurchased: number;
  highestSingleCoinBalance: number;
  highestJobLevel: Record<string, number>;  // historical max
  highestSkillLevel: Record<string, number>;
}
```

Statistics accumulate across rebirths (except timePlayed). Tracked in `gameTick` and in action handlers.

**UI:** New "Stats" tab showing:
- Play time (hh:mm format)
- Total coins earned
- Total XP earned (by category)
- Highest balance achieved
- Rebirth counts
- Town buildings purchased
- Items purchased

## 6. No-Go (out of scope for this pass)

- Offline progress calculation (requires session tracking, complex balance)
- BigNumber library (requires schema migration, deep game changes)
- Evil Perk Shop (needs its own design pass)
- Sound effects
- Keyboard shortcuts

## 7. Implementation Order

1. Phase 1: dev infra (tests work first so we can verify)
2. Phase 2: performance
3. Phase 3: polish
4. Phase 4: features (achievements + stats)
5. Final verification: `npm run build` + `npm test` clean
