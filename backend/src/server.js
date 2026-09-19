const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const { ensureAdminUser } = require("./config/admin");
const { startMonthlyDrawJob } = require("./jobs/monthlyDrawJob");

async function listenWithFallback(startPort, maxAttempts = 10) {
  let currentPort = startPort;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const server = await new Promise((resolve, reject) => {
        const listener = app.listen(currentPort, () => resolve(listener));
        listener.on("error", (error) => {
          if (error.code === "EADDRINUSE") {
            reject(error);
            return;
          }
          reject(error);
        });
      });

      console.log(`Server running on port ${currentPort}`);
      return { server, port: currentPort };
    } catch (error) {
      if (error.code === "EADDRINUSE") {
        console.warn(`Port ${currentPort} is busy. Trying ${currentPort + 1} instead...`);
        currentPort += 1;
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Unable to start server after trying ports ${startPort} to ${currentPort}`);
}

async function bootstrap() {
  try {
    if (env.mongoUri) {
      await connectDB(env.mongoUri);
      await ensureAdminUser(process.env);
      console.log("✅ Admin account ready:", env.seedAdminEmail);
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

  try {
    const { port } = await listenWithFallback(env.port || 5000);
    process.env.PORT = String(port);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}

module.exports = app;