const jwt = require("jsonwebtoken");
const { z } = require("zod");

const User = require("../models/User");
const Charity = require("../models/Charity");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { sendEmail } = require("../utils/emailService");
const { welcomeEmail } = require("../utils/emailTemplates");

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  charityId: z.string().min(1).optional(),
  charityPercentage: z.number().min(10).max(100).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: payload.email });
    if (exists) {
      throw new AppError("Email already registered", 409);
    }

    const userData = {
      name: payload.name,
      email: payload.email,
      password: payload.password
    };

    if (payload.charityId) {
      const charity = await Charity.findById(payload.charityId);
      if (!charity) {
        throw new AppError("Charity not found", 404);
      }
      userData.charity = charity._id;
      userData.charityPercentage = payload.charityPercentage || 10;
    }

    const user = await User.create(userData);
    const token = signToken(user._id);

    sendEmail({
      to: user.email,
      subject: "Welcome to Golf Platform",
      html: welcomeEmail(user.name)
    }).catch(() => undefined);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email }).select("+password");
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await user.comparePassword(payload.password);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = signToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate("charity", "name image");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  me
};
