const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Charity = require("../models/Charity");
const Draw = require("../models/Draw");
const Winner = require("../models/Winner");
const Score = require("../models/Score");
const AppError = require("../utils/AppError");
const { z } = require("zod");

const adminUpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["user", "admin"]).optional(),
  subscriptionStatus: z.enum(["active", "inactive", "expired"]).optional(),
  charityPercentage: z.number().min(10).max(100).optional()
});

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .populate("charity", "name image totalDonations")
      .populate("subscriptionId");

    const [scoreCount, latestPublishedDraw, winners] = await Promise.all([
      Score.countDocuments({ user: req.user._id }),
      Draw.findOne({ status: "published" }).sort({ month: -1 }),
      Winner.find({ user: req.user._id }).sort({ createdAt: -1 })
    ]);

    const totalWon = winners.reduce((sum, winner) => sum + (winner.prizeAmount || 0), 0);

    res.status(200).json({
      user,
      dashboard: {
        participation: {
          drawsEntered: winners.length,
          upcomingDrawMonth: latestPublishedDraw?.month || null
        },
        winnings: {
          totalWon,
          currentStatuses: winners.map((item) => item.status)
        },
        scoreCount
      }
    });
  } catch (error) {
    next(error);
  }
}

async function adminAnalytics(req, res, next) {
  try {
    const [totalUsers, totalRevenueAgg, totalCharityAgg, totalPrizeAgg, drawCount, pendingWinners] = await Promise.all([
      User.countDocuments(),
      Subscription.aggregate([{ $match: { status: "active" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Charity.aggregate([{ $group: { _id: null, total: { $sum: "$totalDonations" } } }]),
      Draw.aggregate([{ $match: { status: "published" } }, { $group: { _id: null, total: { $sum: "$totalPool" } } }]),
      Draw.countDocuments(),
      Winner.countDocuments({ status: "pending" })
    ]);

    res.status(200).json({
      metrics: {
        totalUsers,
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        totalCharityFunds: totalCharityAgg[0]?.total || 0,
        totalPrizePool: totalPrizeAgg[0]?.total || 0,
        drawCount,
        pendingWinners
      }
    });
  } catch (error) {
    next(error);
  }
}

async function adminListUsers(req, res, next) {
  try {
    const q = (req.query.q || "").trim();
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } }
          ]
        }
      : {};
    const users = await User.find(filter).populate("charity", "name").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

async function adminUpdateUser(req, res, next) {
  try {
    const payload = adminUpdateUserSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

const adminCreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional(),
  subscriptionStatus: z.enum(["active", "inactive", "expired"]).optional(),
  charityPercentage: z.number().min(10).max(100).optional()
});

// ---------- Create User (Admin) ----------
async function adminCreateUser(req, res, next) {
  try {
    const payload = adminCreateUserSchema.parse(req.body);
    // Check for existing email
    const existing = await User.findOne({ email: payload.email });
    if (existing) {
      throw new AppError("Email already in use", 409);
    }
    const user = await User.create(payload);
    // Do not return password hash
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ user: userObj });
  } catch (error) {
    next(error);
  }
}

// ---------- Delete User (Admin) ----------
async function adminDeleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  adminAnalytics,
  adminListUsers,
  adminUpdateUser,
  adminCreateUser,
  adminDeleteUser
};
