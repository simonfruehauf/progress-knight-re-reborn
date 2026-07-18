# Progress Knight — Reborn

An incremental/idle RPG rebuilt from vanilla JavaScript into a modern React + TypeScript + Vite stack. Start as a beggar and progress through jobs, skills, magic, and rebirths across multiple lifetimes.

## Tech Stack

- **React 18** — UI framework
- **TypeScript 5** — Type safety
- **Vite 5** — Build tool
- **Zustand** — State management
- **Web Workers** — Game loop

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Building for Production

```bash
npm run build
npm run preview
```

The build output goes to `dist/`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
| `npm run lint` | Lint source code |
| `npm run format` | Format source code with Prettier |

## Project Structure

```
src/
├── engine/          # Pure game logic (no React)
│   ├── data/        # Game data definitions
│   ├── game.ts      # Main tick function
│   ├── rebirth.ts   # Rebirth mechanics
│   ├── time.ts      # Speed/time calculations
│   ├── economy.ts   # Coin formatting & expenses
│   ├── requirements.ts  # Unlock conditions
│   ├── town.ts      # Town income calculations
│   └── save.ts      # Save/load system
├── store/           # Zustand state management
├── hooks/           # React hooks (game loop, autosave)
├── components/      # React UI components
│   ├── common/      # Reusable UI primitives
│   └── tabs/        # Game tab views
└── styles/          # CSS stylesheets
```

## Credits

Original game by [ihtasham42](https://github.com/ihtasham42), extended by Cameron Gott.
This TypeScript/React rebuild by [contributor name].
