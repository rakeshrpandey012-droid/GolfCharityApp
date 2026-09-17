const { z } = require("zod");
const mongoose = require("mongoose");

const Draw = require("../models/Draw");
const Score = require("../models/Score");
const User = require("../models/User");
const Winner = require("../models/Winner");
const Subscription = require("../models/Subscription");
const env = require("../config/env");

const { generateAlgorithmNumbers, generateUniqueNumbers, matchCount } = require("../utils/drawEngine");
const { calculatePrizes } = require("../utils/prizeCalculator");
const { sendEmail } = require("../utils/emailService");
const { winnerAlertEmail, drawResultsEmail } = require("../utils/emailTemplates");
const AppError = require("../utils/AppError");

const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, "month must be YYYY-MM").optional();

const createDraftSchema = z.object({
  type: z.enum(["random", "algorithm", "manual"]).default("random"),
  month: monthSchema,
  manualNumbers: z.array(z.number().min(1).max(45)).length(5).optional()
});

const runDrawSchema = z.object({
  type: z.enum(["random", "algorithm", "manual"]).default("random"),
  month: monthSchema,
  manualNumbers: z.array(z.number().min(1).max(45)).length(5).optional()
});

function getMonthKey(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getActiveSubscriptionFee() {
  return Number(env.monthlyPrice || 0);
}

function groupWinnersByMatchType(winners) {
  return winners.reduce(
    (acc, winner) => {
      acc[winner.matchType] = (acc[winner.matchType] || 0) + 1;
      return acc;
    },
    { "3": 0, "4": 0, "5": 0 }
  );
}

async function resolveDrawParticipants() {
  const now = new Date();

  const activeSubscriptions = await Subscription.find({
    status: "active",
    expiryDate: { $gt: now }
  }).select("user");

  const subscriberIds = [...new Set(activeSubscriptions.map((subscription) => String(subscription.user)))];
  if (subscriberIds.length === 0) {
    return { subscriberCount: 0, eligibleUsers: [] };
  }

  const subscriberObjectIds = subscriberIds.map((id) => new mongoose.Types.ObjectId(id));

  const eligibleCounts = await Score.aggregate([
    { $match: { user: { $in: subscriberObjectIds } } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
    { $match: { count: { $gte: 5 } } }
  ]);

  const eligibleUserIds = eligibleCounts.map((item) => String(item._id));

  const users = await User.find({ _id: { $in: eligibleUserIds } }).select("_id email name");
  return {
    subscriberCount: subscriberIds.length,
    eligibleUsers: users
  };
}

async function buildDrawComputation(draw) {
  const lastPublishedDraw = await Draw.findOne({ status: "published" }).sort({ createdAt: -1 });
  const carryIn = Number(lastPublishedDraw?.jackpotCarryForward || 0);

  const { subscriberCount, eligibleUsers } = await resolveDrawParticipants();
  const subscriptionFee = getActiveSubscriptionFee();
  const basePool = Number((subscriberCount * subscriptionFee).toFixed(2));

  const winnerDocs = [];
  for (const user of eligibleUsers) {
    const scores = await Score.find({ user: user._id }).sort({ date: -1, createdAt: -1 }).limit(5);
    const userScores = scores.map((item) => item.score);
    const matches = matchCount(userScores, draw.numbers);

    if (matches >= 3) {
      winnerDocs.push({
        user: user._id,
        draw: draw._id,
        matchType: String(matches)
      });
    }
  }

  const groupedWinners = groupWinnersByMatchType(winnerDocs);
  const prizes = calculatePrizes({
    basePool,
    carryIn,
    winnerGroups: groupedWinners
  });

  const prizeAssignedWinners = winnerDocs.map((winner) => ({
    ...winner,
    prizeAmount: prizes[winner.matchType] || 0
  }));

  return {
    subscriptionFee,
    subscriberCount,
    participantCount: eligibleUsers.length,
    basePool,
    totalPool: Number((basePool + carryIn).toFixed(2)),
    carryIn,
    carryOut: prizes.carryOut,
    groupedWinners,
    winners: prizeAssignedWinners,
    participants: eligibleUsers,
    prizeBreakdown: {
      "3": prizes["3"],
      "4": prizes["4"],
      "5": prizes["5"]
    }
  };
}

async function createDraft(req, res, next) {
  try {
    const { type, month, manualNumbers } = createDraftSchema.parse(req.body || {});
    const targetMonth = month || getMonthKey();

    const existing = await Draw.findOne({ month: targetMonth });
    if (existing) {
      throw new AppError("Draw for this month already exists", 409);
    }

    let numbers;
    if (type === "manual") {
      if (!manualNumbers || manualNumbers.length !== 5) {
        throw new AppError("Manual draw requires exactly 5 numbers", 400);
      }
      numbers = [...new Set(manualNumbers)].sort((a, b) => a - b);
      if (numbers.length !== 5) {
        throw new AppError("Manual draw requires 5 unique numbers", 400);
      }
    } else {
      numbers = type === "algorithm" ? await generateAlgorithmNumbers() : generateUniqueNumbers(5, 1, 45);
    }

    const draw = await Draw.create({
      numbers,
      type,
      month: targetMonth,
      status: "draft"
    });

    res.status(201).json({ draw });
  } catch (error) {
    next(error);
  }
}

async function simulateDraft(req, res, next) {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      throw new AppError("Draw not found", 404);
    }

    if (draw.status !== "draft") {
      throw new AppError("Only draft draws can be simulated", 400);
    }

    const simulation = await buildDrawComputation(draw);

    res.status(200).json({
      draw: {
        id: draw._id,
        month: draw.month,
        numbers: draw.numbers,
        type: draw.type,
        status: draw.status
      },
      simulation
    });
  } catch (error) {
    next(error);
  }
}

async function publishDraft(req, res, next) {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      throw new AppError("Draw not found", 404);
    }

    if (draw.status !== "draft") {
      throw new AppError("Draw is already published", 409);
    }

    const result = await buildDrawComputation(draw);

    if (result.winners.length > 0) {
      await Winner.insertMany(result.winners);
    }

    draw.status = "published";
    draw.subscriptionFee = result.subscriptionFee;
    draw.subscriberCount = result.subscriberCount;
    draw.basePool = result.basePool;
    draw.totalPool = result.totalPool;
    draw.jackpotCarryForward = result.carryOut;
    await draw.save();

    const winnerIds = result.winners.map((winner) => String(winner.user));

    result.participants.forEach((user) => {
      const isWinner = winnerIds.includes(String(user._id));
      sendEmail({
        to: user.email,
        subject: isWinner ? "Winner Alert" : "Monthly Draw Results",
        html: isWinner ? winnerAlertEmail(user.name, draw.month) : drawResultsEmail(user.name, draw.month)
      }).catch(() => undefined);
    });

    res.status(200).json({
      draw,
      summary: {
        participants: result.participantCount,
        winners: result.groupedWinners,
        carryForward: result.carryOut
      }
    });
  } catch (error) {
    next(error);
  }
}

async function runDraw(req, res, next) {
  try {
    const { type, month, manualNumbers } = runDrawSchema.parse(req.body || {});
    const targetMonth = month || getMonthKey();

    let draw = await Draw.findOne({ month: targetMonth });
    if (draw && draw.status === "published") {
      throw new AppError("Draw for this month already published", 409);
    }

    if (!draw) {
      let numbers;
      if (type === "manual") {
        if (!manualNumbers || manualNumbers.length !== 5) {
          throw new AppError("Manual draw requires exactly 5 numbers", 400);
        }
        numbers = [...new Set(manualNumbers)].sort((a, b) => a - b);
        if (numbers.length !== 5) {
          throw new AppError("Manual draw requires 5 unique numbers", 400);
        }
      } else {
        numbers = type === "algorithm" ? await generateAlgorithmNumbers() : generateUniqueNumbers(5, 1, 45);
      }

      draw = await Draw.create({
        numbers,
        type,
        month: targetMonth,
        status: "draft"
      });
    }

    req.params.id = String(draw._id);
    await publishDraft(req, res, next);
  } catch (error) {
    next(error);
  }
}

async function latestDraw(req, res, next) {
  try {
    const draw = await Draw.findOne({ status: "published" }).sort({ month: -1 });
    res.status(200).json({ draw });
  } catch (error) {
    next(error);
  }
}

async function listDrawHistory(req, res, next) {
  try {
    const draws = await Draw.find({ status: "published" }).sort({ month: -1, createdAt: -1 });
    res.status(200).json({ draws });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  runDraw,
  createDraft,
  simulateDraft,
  publishDraft,
  latestDraw,
  listDrawHistory,
  getMonthKey
};
