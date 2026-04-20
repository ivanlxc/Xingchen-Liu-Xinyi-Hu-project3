import express from 'express';
import Highscore from '../db/schema/highscore.schema.js';
import Game from '../db/schema/game.schema.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const agg = await Highscore.aggregate([
    {
      $group: {
        _id: '$userId',
        username: { $first: '$username' },
        wins: { $sum: 1 },
      },
    },
    { $match: { wins: { $gt: 0 } } },
    { $sort: { wins: -1, username: 1 } },
  ]);
  res.json(
    agg.map((row) => ({
      userId: row._id,
      username: row.username,
      wins: row.wins,
    }))
  );
});

router.get('/:gameId', async (req, res) => {
  const scores = await Highscore.find({ gameId: req.params.gameId })
    .sort({ durationSeconds: 1, completedAt: 1 })
    .lean();
  res.json(
    scores.map((s) => ({
      userId: s.userId,
      username: s.username,
      durationSeconds: s.durationSeconds,
      completedAt: s.completedAt,
    }))
  );
});

router.post('/', requireAuth, async (req, res) => {
  const { gameId, durationSeconds } = req.body || {};
  if (!gameId || !Number.isFinite(durationSeconds) || durationSeconds < 0) {
    return res.status(400).json({ error: 'gameId and non-negative durationSeconds are required.' });
  }

  const game = await Game.findById(gameId);
  if (!game) return res.status(404).json({ error: 'Game not found.' });

  const existing = await Highscore.findOne({ gameId: game._id, userId: req.user._id });
  if (existing) {
    if (durationSeconds < existing.durationSeconds) {
      existing.durationSeconds = durationSeconds;
      existing.completedAt = new Date();
      await existing.save();
    }
    return res.json({
      ok: true,
      updated: durationSeconds < existing.durationSeconds,
      durationSeconds: existing.durationSeconds,
    });
  }

  await Highscore.create({
    gameId: game._id,
    userId: req.user._id,
    username: req.user.username,
    durationSeconds: Math.floor(durationSeconds),
  });
  res.status(201).json({ ok: true, durationSeconds: Math.floor(durationSeconds) });
});

export default router;
