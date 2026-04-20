import express from 'express';
import Game from '../db/schema/game.schema.js';
import Highscore from '../db/schema/highscore.schema.js';
import { requireAuth, loadUserFromCookie } from '../middleware/auth.js';
import { generateSudoku, validateCustomPuzzle } from '../utils/sudoku.js';
import { randomGameName } from '../utils/wordList.js';

const router = express.Router();

function serializeGame(g, includeSolution = false) {
  const base = {
    id: g._id,
    name: g.name,
    difficulty: g.difficulty,
    size: g.size,
    initialBoard: g.initialBoard,
    createdByUsername: g.createdByUsername,
    createdBy: g.createdBy,
    createdAt: g.createdAt,
  };
  if (includeSolution) base.solution = g.solution;
  return base;
}

async function generateUniqueName(maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i++) {
    const name = randomGameName();
    const exists = await Game.exists({ name });
    if (!exists) return name;
  }
  return `${randomGameName()} ${Date.now()}`;
}

router.get('/', async (req, res) => {
  const games = await Game.find().sort({ createdAt: -1 }).lean();
  res.json(
    games.map((g) => ({
      id: g._id,
      name: g.name,
      difficulty: g.difficulty,
      size: g.size,
      createdByUsername: g.createdByUsername,
      createdAt: g.createdAt,
    }))
  );
});

router.get('/:id', async (req, res) => {
  const game = await Game.findById(req.params.id).lean();
  if (!game) return res.status(404).json({ error: 'Game not found.' });

  const user = await loadUserFromCookie(req);
  let completed = null;
  if (user) {
    completed = await Highscore.findOne({ gameId: game._id, userId: user._id }).lean();
  }

  const payload = {
    id: game._id,
    name: game.name,
    difficulty: game.difficulty,
    size: game.size,
    initialBoard: game.initialBoard,
    createdByUsername: game.createdByUsername,
    createdBy: game.createdBy,
    createdAt: game.createdAt,
    completed: !!completed,
  };
  if (completed) {
    payload.solution = game.solution;
    payload.durationSeconds = completed.durationSeconds;
    payload.completedAt = completed.completedAt;
  }
  res.json(payload);
});

router.post('/', requireAuth, async (req, res) => {
  const difficultyRaw = (req.body?.difficulty || '').toString().toUpperCase();
  if (difficultyRaw !== 'EASY' && difficultyRaw !== 'NORMAL') {
    return res.status(400).json({ error: 'difficulty must be "EASY" or "NORMAL".' });
  }
  const { puzzle, solution, size } = generateSudoku(difficultyRaw);
  const name = await generateUniqueName();
  const game = await Game.create({
    name,
    difficulty: difficultyRaw,
    size,
    initialBoard: puzzle,
    solution,
    createdBy: req.user._id,
    createdByUsername: req.user.username,
  });
  res.status(201).json({ id: game._id, name: game.name });
});

router.post('/custom', requireAuth, async (req, res) => {
  const { puzzle } = req.body || {};
  const result = validateCustomPuzzle(puzzle);
  if (!result.ok) return res.status(400).json({ error: result.error });

  const name = await generateUniqueName();
  const game = await Game.create({
    name,
    difficulty: 'CUSTOM',
    size: 9,
    initialBoard: puzzle,
    solution: result.solution,
    createdBy: req.user._id,
    createdByUsername: req.user.username,
  });
  res.status(201).json({ id: game._id, name: game.name });
});

router.put('/:id', requireAuth, async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) return res.status(404).json({ error: 'Game not found.' });
  if (game.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Only the creator may edit this game.' });
  }
  const { name } = req.body || {};
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'New name is required.' });
  }
  const trimmed = name.trim();
  const clash = await Game.findOne({ name: trimmed, _id: { $ne: game._id } });
  if (clash) return res.status(409).json({ error: 'Another game already uses that name.' });

  game.name = trimmed;
  await game.save();
  res.json(serializeGame(game));
});

router.delete('/:id', requireAuth, async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) return res.status(404).json({ error: 'Game not found.' });
  if (game.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Only the creator may delete this game.' });
  }
  await Highscore.deleteMany({ gameId: game._id });
  await game.deleteOne();
  res.json({ ok: true });
});

export default router;
