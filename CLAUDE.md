# Habit Tracker

## Architecture
Full-stack app (frontend is still vanilla JS at this stage).

- `backend/` — Express + MongoDB (Mongoose) API
  - `models/Habit.js` — Mongoose schema
  - `controllers/habitController.js` — request handlers
  - `routes/habits.js` — Express router, mounted at `/api/habits`
  - `server.js` — app entry point; also serves `public/` as static files
- `public/` — vanilla JS frontend, served by Express (not opened via `file://` anymore)
  - `js/habits.js` — talks to the backend API
  - `js/filter.js` — pure client-side filtering logic (unchanged since earlier sessions)
  - `js/render.js` — DOM rendering
  - `js/main.js` — wires everything together

## Commands
- Install: `cd backend && npm install`
- Run: `cd backend && npm start` (serves both API and frontend at `http://localhost:3001`)
- Test backend: `cd backend && npm test`
- Test frontend filter logic: `node tests/test-filter.js` (from project root)

## Conventions
@docs/conventions.md