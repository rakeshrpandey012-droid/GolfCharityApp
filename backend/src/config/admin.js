const User = require("../models/User");

function normalizeAdminConfig(env = process.env) {
  return {
    name: env.SEED_ADMIN_NAME || "Platform Admin",
    email: env.SEED_ADMIN_EMAIL || "admin@golfplatform.com",
    password: env.SEED_ADMIN_PASSWORD || "Admin@123",
    role: "admin",
    subscriptionStatus: "active",
    charityPercentage: 10,
  };
}

async function ensureAdminUser(env = process.env) {
  const config = normalizeAdminConfig(env);

  const existing = await User.findOne({ email: config.email.toLowerCase() });

  if (existing) {
    const needsUpdate =
      existing.name !== config.name ||
      existing.role !== config.role ||
      existing.subscriptionStatus !== config.subscriptionStatus ||
      existing.charityPercentage !== config.charityPercentage;

    if (needsUpdate) {
      existing.name = config.name;
      existing.role = config.role;
      existing.subscriptionStatus = config.subscriptionStatus;
      existing.charityPercentage = config.charityPercentage;
      await existing.save();
    }

    return { ...config, exists: true };
  }

  const user = await User.create({
    ...config,
    email: config.email.toLowerCase(),
  });

  return { ...config, id: user._id, exists: false };
}

module.exports = {
  ensureAdminUser,
  normalizeAdminConfig,
};
