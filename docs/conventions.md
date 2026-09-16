# Coding Conventions

- Backend uses async/await throughout — no `.then()` chains, no callbacks.
- MongoDB documents use `_id`, not `id`. Never rename this on the way out of the API — the frontend expects `_id` directly.
- Controllers never throw uncaught errors to the client — every handler either succeeds with a 2xx response or returns a specific 4xx/5xx status with a JSON `{ error: "..." }` body.
- Frontend functions that call the API are always `async` and return the parsed JSON — no bare `fetch()` calls left unresolved in UI code.
- No new npm dependencies without discussing it first — this project intentionally stays on `express`, `mongoose`, and `cors` only.