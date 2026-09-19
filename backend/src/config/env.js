const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI,
  seedAdminName: process.env.SEED_ADMIN_NAME || "Platform Admin",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || "admin@golfplatform.com",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || "Admin@123",
  jwtSecret: process.env.JWT_SECRET || "golf_app_secret_12345",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  frontendDeployUrl: process.env.FRONTEND_DEPLOY_URL || "http://localhost:5174",
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174").split(",").map((origin) => origin.trim()).filter(Boolean),
  monthlyPrice: Number(process.env.MONTHLY_PRICE || 29),
  yearlyPrice: Number(process.env.YEARLY_PRICE || 299),
  monthlyPriceId: process.env.MONTHLY_PRICE_ID,
  yearlyPriceId: process.env.YEARLY_PRICE_ID,
  emailHost: process.env.EMAIL_HOST,
  emailPort: Number(process.env.EMAIL_PORT || 587),
  emailService: process.env.EMAIL_SERVICE || "Gmail",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@golfplatform.com",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};

module.exports = env;
