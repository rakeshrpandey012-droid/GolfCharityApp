const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

const connectDB = require("./config/db");
const env = require("./config/env");

let dbReady = false;

async function ensureDbConnection() {
  if (!env.mongoUri) return;
  if (dbReady) return;

  await connectDB(env.mongoUri);
  dbReady = true;
}

app.use(async (req, res, next) => {
  try {
    await ensureDbConnection();
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ message: "Database connection error" });
  }
});

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const drawRoutes = require('./routes/drawRoutes');
const adminDrawRoutes = require('./routes/adminDrawRoutes');
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const charityRoutes = require("./routes/charityRoutes");
const winnerRoutes = require("./routes/winnerRoutes");
const { handleWebhook } = require("./controllers/subscriptionController");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

app.use(helmet());

const allowedOrigins = [
  env.frontendUrl,
  env.frontendDeployUrl,
  ...env.corsOrigins,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  })
);

app.use(morgan("dev"));
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 300
//   })
// );

app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running" });
});

app.use("/api/subscriptions/webhook", express.raw({ type: "application/json" }));
app.use("/api/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draws", drawRoutes);
app.use("/api/admin/draws", adminDrawRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/subscribe", subscriptionRoutes);
app.post("/api/webhook", handleWebhook);
app.use("/api/charities", charityRoutes);
app.use("/api/winners", winnerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;