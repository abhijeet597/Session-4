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
- Test backend: `cd backend && npm test` (runs Node's built-in test runner — `node --test` — against `backend/tests/*.js`, currently `test-habitController.js`)
- Test frontend filter logic: `node tests/test-filter.js` (from project root)

## Conventions
@docs/conventions.md

## Known in-progress / broken state
- `backend/package.json` lists `bcryptjs` and `jsonwebtoken` as dependencies but neither is used anywhere — this violates the "express/mongoose/cors only" rule in conventions.md. Don't build on them without confirming with the user; they may be leftover from planned-but-abandoned auth work.
- `habitController.js`: `updateHabit` and `deleteHabit` are stubs returning `501 Not Implemented`. `backend/tests/test-habitController.js` already contains tests expecting full 200/204/404 behavior for both — those tests currently fail.
- `public/js/habits.js`: `deleteHabit()` has a known bug — it mutates a stale local array instead of calling the DELETE API.
- `public/js/main.js` calls `sortHabits()` and `checkInHabit()`, but neither is defined anywhere in `public/js/*.js` or `index.html` — calling them throws `ReferenceError`.