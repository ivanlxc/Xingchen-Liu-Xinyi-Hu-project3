# Sudoku Master — CS5610 Project 3

A full-stack Sudoku game by **Xingchen Liu** and **Xinyi Hu**.

**Live demo:** _TBD — will add after deploying to Render_
**Demo video:** _TBD — will add after recording_

## What it does

You can sign up, log in, and play Sudoku. Every game is saved in the
database with a random 3-word name (like "Coconut Red House"). There are
three difficulty options: Easy (6×6), Normal (9×9), and Custom (you make
your own). The leaderboard shows everyone ranked by total wins.

## Pages

- `/` — landing page
- `/games` — list of every saved game plus buttons to create a new one
- `/game/:id` — play a specific game. Shows the solution if you already solved it.
- `/custom` — make your own 9×9 puzzle. The server checks it has exactly one solution.
- `/rules` — how to play + credits
- `/scores` — leaderboard
- `/login` and `/register` — account stuff

Logged-out users can see every page but can't interact.

## Tech stack

- **Frontend:** React 19, React Router 7, Vite 6, plain CSS
- **Backend:** Node.js, Express 4, Mongoose 8
- **Database:** MongoDB Atlas (collections: `users`, `games`, `highscores`)
- **Auth:** signed HTTP-only cookies + bcrypt

## Bonus features we did

| Bonus               | Points | Notes                                                  |
|---------------------|--------|--------------------------------------------------------|
| Password encryption | +2     | bcrypt hash on register, compare on login              |
| Delete Game         | +5     | Creator-only delete button; also removes related wins |
| Custom Games        | +10    | Server checks for a unique solution before saving      |
| AI Survey           | +1     | Screenshot attached to Canvas submission               |
| Early submission    | +3     | See Canvas timestamp                                   |

See [`WRITEUP.md`](WRITEUP.md) for the rest of the writeup (challenges,
assumptions, what we'd add next, time spent).

## Credits

- **Xingchen Liu** — liu.xingche@northeastern.edu
- **Xinyi Hu** — hu.xinyi5@northeastern.edu

Built on top of our [Project 2](https://github.com/ivanlxc/Xingchen-Liu-Xinyi-Hu-project2)
(which had our Sudoku generator and unique-solution checker) and the CS5610
[Project 3 template](https://github.com/ajorgense1-chwy/cs5610_project3_template).
