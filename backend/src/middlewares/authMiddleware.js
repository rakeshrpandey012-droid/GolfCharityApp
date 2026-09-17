const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { syncUserSubscriptionStatus } = require("../utils/subscriptionStatus");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.id);

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    await syncUserSubscriptionStatus(user);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { protect };
