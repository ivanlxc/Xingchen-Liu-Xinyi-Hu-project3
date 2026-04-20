# CS5610 Project 3 — Writeup

**Team:** Xingchen Liu, Xinyi Hu
**Project:** Sudoku Master — full-stack Sudoku with accounts and custom puzzles.

We wrote this writeup together.

## Challenges we ran into

The biggest one was **merging two different starting points**. Our Project 2
was a Create React App with everything running in the browser. The teacher's
template used Vite + Express + Mongoose. Getting them to play nicely meant
picking one build tool (we went with Vite from the template), deciding where
the Sudoku logic should live (we moved it to the server so every player sees
the same puzzle), and rewriting our old `GameContext` to use API calls
instead of localStorage.

**Auth was also a pain.** We ended up using signed cookies from
`cookie-parser` instead of JWT or sessions. It kept things simple, but we
still had to play with the `secure` / `sameSite` / `httpOnly` flags a few
times before login worked in both dev and on Render.

**The custom puzzle check was tricky.** The solver can get slow on almost-empty
boards. We added two things to keep it fast: stopping as soon as we find a
second solution, and doing a quick duplicate-check on the input first so bad
puzzles fail immediately with a clear error.

## Things we'd add if we had more time

- **Dark mode.** The CSS already uses variables for colors, so it wouldn't
  be that hard.
- **Better difficulty ratings** (easy / medium / hard) instead of just two
  levels. Would need to count clues and maybe the techniques required.
- **Per-game leaderboards** showing best times. We already save the times,
  we just don't show them on a page yet.
- **Mobile keypad.** The number input works on phones but feels clunky.
- **Tests.** We didn't have time to write any. Starting with unit tests for
  the solver would make sense.
- **Social stuff** — following other players, daily puzzles, etc. Out of
  scope but would be fun.

## Assumptions we made

- The user brings their own MongoDB Atlas cluster (we don't ship a database).
- We trust the client-reported time when recording a score. Someone could
  cheat by sending a 0, but server-side time verification would mean
  replaying every move and that felt like overkill.
- A user's "wins" count unique puzzles, not total plays. Replaying the same
  puzzle doesn't give you another win — we just update your best time. The
  `{gameId, userId}` index enforces this.
- Anyone can browse every page without logging in, but only logged-in users
  can create, play, delete, or submit custom puzzles. That's what the
  assignment asked for.
- One signed cookie is enough for auth. We don't invalidate sessions on
  password change.

## How long it took

- Scaffolding + moving Sudoku logic over + the backend: **~6 hours**
- Frontend pages, auth context, fitting our old components to the new
  server-driven state: **~5 hours**
- Bonus features (custom puzzles + delete with cascade): **~3 hours**
- Styling polish, README, writeup, Render setup: **~3 hours**

**Total: around 17 hours across the two of us.**

## Bonus points we did

### +2 — Password encryption

Passwords are hashed with bcrypt (cost factor 10) before they're saved. The
raw password never touches the database. Login uses `bcrypt.compare` to
check.

Code: [`backend/api/user.api.js`](backend/api/user.api.js), the `register`
and `login` handlers.

### +5 — Delete Game (with cascade)

When the creator of a game opens its page, a red **Delete** button shows up.
Clicking it (after a confirm dialog) hits `DELETE /api/sudoku/:id`. That
handler:

1. Checks the caller is the creator (403 otherwise).
2. Deletes every high score linked to that game, so people who won it lose
   that win on the leaderboard.
3. Deletes the game itself.

Code: the `DELETE /:id` handler in
[`backend/api/sudoku.api.js`](backend/api/sudoku.api.js) and `handleDelete`
in [`src/pages/GamePage.jsx`](src/pages/GamePage.jsx).

### +10 — Custom Games

The `/custom` page shows an empty 9×9 board and lets you type in clues. The
client highlights row/column/box conflicts as you type. Hitting Submit sends
the grid to `/api/sudoku/custom`, which:

1. Checks the shape (has to be 9×9, values 0–9).
2. Checks for duplicate clues in rows/columns/boxes.
3. Runs the backtracking solver with `maxCount = 2`:
   - 0 solutions → rejected.
   - 2 solutions → rejected ("add more clues").
   - Exactly 1 → saved, and the user is redirected to the new game page.

This is the same solver we originally wrote for Project 2 — we just reused
it on the server for validation.

Code: `validateCustomPuzzle` in
[`backend/utils/sudoku.js`](backend/utils/sudoku.js), the `POST /custom`
handler in [`backend/api/sudoku.api.js`](backend/api/sudoku.api.js), and the
UI in [`src/pages/Custom.jsx`](src/pages/Custom.jsx).

### +1 — AI Survey

One of us filled out the survey. Screenshot is attached to the Canvas
submission.

### +3 — Early submission

See the submission timestamp on Canvas.
