const { z } = require("zod");

const stripe = require("../config/stripe");
const env = require("../config/env");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Charity = require("../models/Charity");
const AppError = require("../utils/AppError");
const { sendEmail } = require("../utils/emailService");
const { subscriptionActivatedEmail, subscriptionRenewedEmail } = require("../utils/emailTemplates");
const { syncUserSubscriptionStatus } = require("../utils/subscriptionStatus");

const subscribeSchema = z.object({
  plan: z.enum(["monthly", "yearly"])
});

function getPlanAmount(plan) {
  return plan === "monthly" ? env.monthlyPrice : env.yearlyPrice;
}

function getExpiry(plan) {
  const now = new Date();
  if (plan === "monthly") {
    now.setMonth(now.getMonth() + 1);
  } else {
    now.setFullYear(now.getFullYear() + 1);
  }
  return now;
}

async function createCheckoutSession(req, res, next) {
  try {
    const { plan } = subscribeSchema.parse(req.body);

    const user = await User.findById(req.user._id);
    const amount = getPlanAmount(plan);

    // MOCK GATEWAY OVERRIDE (Bypassing Stripe for immediate frontend UI testing)
    const mockSessionId = "cs_mock_" + Math.random().toString(36).substring(2, 15);

    const charityPercent = user.charityPercentage || 10;
    const charityAmount = Number(((amount * charityPercent) / 100).toFixed(2));

    await Subscription.create({
      user: user._id,
      plan,
      stripeSessionId: mockSessionId,
      status: "created",
      amount,
      expiryDate: getExpiry(plan),
      charityAmount
    });

    res.status(200).json({
      sessionId: mockSessionId,
      checkoutUrl: `/checkout-simulation?session_id=${mockSessionId}&amount=${amount}`
    });
  } catch (error) {
    next(error);
  }
}

async function simulateWebhook(req, res, next) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) throw new AppError("Session ID required", 400);

    const subscription = await Subscription.findOne({ stripeSessionId: sessionId });
    if (!subscription) throw new AppError("Transaction invalid or expired.", 404);

    if (subscription.status === "active") {
      return res.status(200).json({ success: true, message: "Already active." });
    }

    subscription.status = "active";
    subscription.stripeCustomerId = "cus_mock_" + Math.random().toString(36).substring(2, 10);
    await subscription.save();

    const user = await User.findById(subscription.user);
    if (user) {
      user.subscriptionStatus = "active";
      user.subscriptionId = subscription._id;
      await user.save();

      if (user.charity) {
        await Charity.findByIdAndUpdate(user.charity, { $inc: { totalDonations: subscription.charityAmount } });
      }

      const { subscriptionActivatedEmail } = require("../utils/emailTemplates");
      const { sendEmail } = require("../utils/emailService");
      
      sendEmail({
        to: user.email,
        subject: "Subscription Activated",
        html: subscriptionActivatedEmail()
      }).catch(() => undefined);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function handleWebhook(req, res, next) {
  try {
    if (!stripe) {
      throw new AppError("Stripe is not configured", 500);
    }

    const signature = req.headers["stripe-signature"];
    let event;

    if (env.stripeWebhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const subscription = await Subscription.findOne({ stripeSessionId: session.id });
      if (!subscription) {
        return res.status(200).json({ received: true });
      }

      subscription.status = "active";
      subscription.stripeCustomerId = session.customer;
      await subscription.save();

      const user = await User.findById(subscription.user);
      if (user) {
        user.subscriptionStatus = "active";
        user.subscriptionId = subscription._id;
        await user.save();

        if (user.charity) {
          await Charity.findByIdAndUpdate(user.charity, { $inc: { totalDonations: subscription.charityAmount } });
        }

        sendEmail({
          to: user.email,
          subject: "Subscription Activated",
          html: subscriptionActivatedEmail()
        }).catch(() => undefined);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
}

async function listMySubscriptions(req, res, next) {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ subscriptions });
  } catch (error) {
    next(error);
  }
}

async function cancelMySubscription(req, res, next) {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!subscription) {
      throw new AppError("No active subscription found", 404);
    }

    subscription.status = "canceled";
    await subscription.save();

    req.user.subscriptionStatus = "inactive";
    req.user.subscriptionId = undefined;
    await req.user.save();

    res.status(200).json({ message: "Subscription canceled", subscription });
  } catch (error) {
    next(error);
  }
}

async function renewMySubscription(req, res, next) {
  try {
    const { plan } = subscribeSchema.parse(req.body);
    const amount = getPlanAmount(plan);
    const charityPercent = req.user.charityPercentage || 10;
    const charityAmount = Number(((amount * charityPercent) / 100).toFixed(2));

    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      status: "active",
      amount,
      expiryDate: getExpiry(plan),
      charityAmount
    });

    req.user.subscriptionStatus = "active";
    req.user.subscriptionId = subscription._id;
    await req.user.save();

    if (req.user.charity) {
      await Charity.findByIdAndUpdate(req.user.charity, { $inc: { totalDonations: charityAmount } });
    }

    sendEmail({
      to: req.user.email,
      subject: "Subscription Renewed",
      html: subscriptionRenewedEmail(plan)
    }).catch(() => undefined);

    res.status(201).json({ subscription });
  } catch (error) {
    next(error);
  }
}

async function adminListSubscriptions(req, res, next) {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const subscriptions = await Subscription.find(filter)
      .populate("user", "name email subscriptionStatus")
      .sort({ createdAt: -1 });
    res.status(200).json({ subscriptions });
  } catch (error) {
    next(error);
  }
}

const adminUpdateSchema = z.object({
  status: z.enum(["created", "active", "canceled", "expired", "payment_failed"]).optional(),
  expiryDate: z.string().datetime().optional()
});

async function adminUpdateSubscription(req, res, next) {
  try {
    const payload = adminUpdateSchema.parse(req.body);
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    if (payload.status) {
      subscription.status = payload.status;
    }
    if (payload.expiryDate) {
      subscription.expiryDate = new Date(payload.expiryDate);
    }
    await subscription.save();

    const user = await User.findById(subscription.user);
    if (user) {
      await syncUserSubscriptionStatus(user);
    }

    res.status(200).json({ subscription });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
  simulateWebhook,
  listMySubscriptions,
  cancelMySubscription,
  renewMySubscription,
  adminListSubscriptions,
  adminUpdateSubscription
};
