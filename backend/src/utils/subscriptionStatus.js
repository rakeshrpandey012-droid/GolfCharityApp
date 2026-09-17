const Subscription = require("../models/Subscription");
const User = require("../models/User");

async function resolveActiveSubscription(userId) {
  const now = new Date();
  const activeSubscription = await Subscription.findOne({
    user: userId,
    status: "active",
    expiryDate: { $gt: now }
  }).sort({ expiryDate: -1 });

  return activeSubscription;
}

async function syncUserSubscriptionStatus(user) {
  const activeSubscription = await resolveActiveSubscription(user._id);
  const previousSubscriptionCount = await Subscription.countDocuments({ user: user._id });
  const nextStatus = activeSubscription ? "active" : previousSubscriptionCount > 0 ? "expired" : "inactive";

  if (user.subscriptionStatus !== nextStatus) {
    user.subscriptionStatus = nextStatus;
    user.subscriptionId = activeSubscription ? activeSubscription._id : undefined;
    await user.save();
  }

  if (!activeSubscription) {
    await Subscription.updateMany(
      {
        user: user._id,
        status: "active",
        expiryDate: { $lte: new Date() }
      },
      { $set: { status: "expired" } }
    );
  }

  return activeSubscription;
}

module.exports = {
  resolveActiveSubscription,
  syncUserSubscriptionStatus
};
