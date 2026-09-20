const Score = require("../models/Score");
const AppError = require("./AppError");

async function addScoreWithLimit({ userId, score, date }) {
  // Normalize the date to start of day for accurate comparison
  const inputDate = date ? new Date(date) : new Date();
  inputDate.setUTCHours(0, 0, 0, 0);

  // Check for duplicate date
  const existingScoreOnDate = await Score.findOne({
    user: userId,
    date: {
      $gte: inputDate,
      $lt: new Date(inputDate.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (existingScoreOnDate) {
    throw new AppError("A score for this date already exists. Please edit the existing entry.", 400);
  }

  // Find existing scores sorted by date ascending (oldest first)
  const existingScores = await Score.find({ user: userId }).sort({ date: 1, createdAt: 1 });

  // If we already have 5, delete the oldest one(s)
  if (existingScores.length >= 5) {
    // Delete as many as needed to leave room for the new one (usually just 1)
    const toDeleteCount = existingScores.length - 4;
    const scoresToDelete = existingScores.slice(0, toDeleteCount);
    for (const s of scoresToDelete) {
      await Score.findByIdAndDelete(s._id);
    }
  }

  return Score.create({ user: userId, score, date: inputDate });
}

module.exports = { addScoreWithLimit };