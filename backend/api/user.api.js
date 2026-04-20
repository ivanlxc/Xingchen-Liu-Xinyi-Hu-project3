import express from 'express';
import bcrypt from 'bcrypt';
import User from '../db/schema/user.schema.js';
import { loadUserFromCookie } from '../middleware/auth.js';

const router = express.Router();

const COOKIE_OPTS = {
  httpOnly: true,
  signed: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookie(res, userId) {
  res.cookie('userId', userId.toString(), COOKIE_OPTS);
}

function clearAuthCookie(res) {
  res.clearCookie('userId', { ...COOKIE_OPTS, maxAge: undefined });
}

function validateCredentials(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') {
    return 'Username and password are required.';
  }
  const trimmed = username.trim();
  if (trimmed.length < 2 || trimmed.length > 24) {
    return 'Username must be 2–24 characters.';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return 'Username may contain only letters, numbers, or underscores.';
  }
  if (password.length < 4) {
    return 'Password must be at least 4 characters.';
  }
  return null;
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body || {};
  const error = validateCredentials(username, password);
  if (error) return res.status(400).json({ error });

  const trimmed = username.trim();
  const existing = await User.findOne({ username: trimmed });
  if (existing) return res.status(409).json({ error: 'Username already taken.' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username: trimmed, passwordHash });
  setAuthCookie(res, user._id);
  res.status(201).json({ username: user.username });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const user = await User.findOne({ username: username.trim() });
  if (!user) return res.status(401).json({ error: 'Invalid username or password.' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid username or password.' });

  setAuthCookie(res, user._id);
  res.json({ username: user.username });
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/isLoggedIn', async (req, res) => {
  const user = await loadUserFromCookie(req);
  if (!user) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, username: user.username });
});

export default router;
