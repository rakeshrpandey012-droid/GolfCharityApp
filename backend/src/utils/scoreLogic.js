const Score = require("../models/Score");

async function addScoreWithLimit({ userId, score, date }) {
  const existingScores = await Score.find({ user: userId }).sort({ date: 1, createdAt: 1 });

  if (existingScores.length >= 5) {
    await Score.findByIdAndDelete(existingScores[0]._id);
  }

  return Score.create({ user: userId, score, date: date || new Date() });
}

module.exports = { addScoreWithLimit };