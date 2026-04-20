import mongoose from 'mongoose';

const highscoreSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  username: { type: String, required: true },
  durationSeconds: { type: Number, required: true, min: 0 },
  completedAt: { type: Date, default: Date.now },
});

highscoreSchema.index({ gameId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Highscore', highscoreSchema);
