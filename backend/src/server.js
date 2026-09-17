const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const { startMonthlyDrawJob } = require("./jobs/monthlyDrawJob");

async function bootstrap() {
  try {
    if (env.mongoUri) {
      await connectDB(env.mongoUri);
    } else {
      console.warn("⚠️ No MONGO_URI provided, running without DB connection");
    }
  } catch (err) {
    console.warn("⚠️ Failed to connect to DB, continuing anyway", err);
  }
  
  try {
    startMonthlyDrawJob();
  } catch (err) {
    console.warn("⚠️ Failed to start background job", err);
  }

  app.listen(env.port || 5000, () => {
    console.log(`Server running on port ${env.port || 5000}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});