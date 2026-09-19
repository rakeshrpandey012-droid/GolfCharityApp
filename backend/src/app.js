const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// Making changes for Vercel
const connectDB = require("./config/db");
const env = require("./config/env");

app.use(async (req, res, next) => {
  try {
    await connectDB(env.mongoUri);
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ message: "Database connection error" });
  }
});

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const drawRoutes = require("./routes/drawRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const charityRoutes = require("./routes/charityRoutes");
const winnerRoutes = require("./routes/winnerRoutes");
const { handleWebhook } = require("./controllers/subscriptionController");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEPLOY_URL,
  "http://localhost:5173",
  "http://localhost:3000",
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
app.use("/api/draw", drawRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/subscribe", subscriptionRoutes);
app.post("/api/webhook", handleWebhook);
app.use("/api/charities", charityRoutes);
app.use("/api/winners", winnerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;