const { z } = require("zod");
const Score = require("../models/Score");
const { addScoreWithLimit } = require("../utils/scoreLogic");
const AppError = require("../utils/AppError");

const scoreSchema = z.object({
  score: z.number().int().min(1).max(45),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
});

const updateScoreSchema = scoreSchema.partial().refine((value) => value.score !== undefined || value.date !== undefined, {
  message: "At least one of score or date is required"
});

async function createScore(req, res, next) {
  try {
    const parsed = scoreSchema.parse(req.body);
    const date = new Date(`${parsed.date}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      throw new AppError("Invalid score date", 400);
    }

    const entry = await addScoreWithLimit({
      userId: req.user._id,
      score: parsed.score,
      date
    });

    res.status(201).json({ score: entry });
  } catch (error) {
    next(error);
  }
}

async function listScores(req, res, next) {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    res.status(200).json({ scores });
  } catch (error) {
    next(error);
  }
}

async function updateMyScore(req, res, next) {
  try {
    const parsed = updateScoreSchema.parse(req.body);
    const updates = {};
    if (parsed.score !== undefined) {
      updates.score = parsed.score;
    }
    if (parsed.date) {
      const date = new Date(`${parsed.date}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime())) {
        throw new AppError("Invalid score date", 400);
      }
      updates.date = date;
    }

    const score = await Score.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!score) {
      throw new AppError("Score not found", 404);
    }

    res.status(200).json({ score });
  } catch (error) {
    next(error);
  }
}

async function adminUpdateScore(req, res, next) {
  try {
    const parsed = updateScoreSchema.parse(req.body);
    const updates = {};
    if (parsed.score !== undefined) {
      updates.score = parsed.score;
    }
    if (parsed.date) {
      const date = new Date(`${parsed.date}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime())) {
        throw new AppError("Invalid score date", 400);
      }
      updates.date = date;
    }

    const score = await Score.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!score) {
      throw new AppError("Score not found", 404);
    }

    res.status(200).json({ score });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createScore,
  listScores,
  updateMyScore,
  adminUpdateScore
};
