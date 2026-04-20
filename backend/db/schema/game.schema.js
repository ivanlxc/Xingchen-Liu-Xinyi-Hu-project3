import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  difficulty: {
    type: String,
    enum: ['EASY', 'NORMAL', 'CUSTOM'],
    required: true,
  },
  size: { type: Number, enum: [6, 9], required: true },
  initialBoard: { type: [[Number]], required: true },
  solution: { type: [[Number]], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdByUsername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Game', gameSchema);
