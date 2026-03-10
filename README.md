# Recovery Assistant

Web app for the Athlete Recovery Assistant (see [PRD](../tasks/prd-athlete-recovery-assistant.md)).

## Setup

From this directory (`app/`):

```bash
npm install
```

## Run dev server

```bash
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Run tests (Jest)

```bash
npm test
```

Or run a specific test file:

```bash
npx jest src/App.test.tsx
```

## Build

```bash
npm run build
```

## Project structure

- `src/` – app source
  - `components/` – React components (Layout, and later ChatView, ExerciseCard, etc.)
  - `lib/` – utilities (LLM client, schema, extraction)
  - `data/` – exercise database and seed data
  - `types.ts` – shared TypeScript types
