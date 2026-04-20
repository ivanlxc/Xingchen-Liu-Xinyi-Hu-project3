import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';

import userApi from './backend/api/user.api.js';
import sudokuApi from './backend/api/sudoku.api.js';
import highscoreApi from './backend/api/highscore.api.js';

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/sudoku';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'dev-secret-change-me';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

mongoose.connect(MONGODB_URL).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});
const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB error:', err.message));
db.once('open', () => console.log('MongoDB connected.'));

app.use('/api/user', userApi);
app.use('/api/sudoku', sudokuApi);
app.use('/api/highscore', highscoreApi);

const frontendDir = path.join(path.resolve(), 'dist');
app.use(express.static(frontendDir));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
