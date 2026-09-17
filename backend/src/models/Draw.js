const mongoose = require("mongoose");

const drawSchema = new mongoose.Schema(
  {
    numbers: [{ type: Number, min: 1, max: 45, required: true }],
    type: { type: String, enum: ["random", "algorithm", "manual"], default: "random" },
    month: { type: String, required: true, unique: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    jackpotCarryForward: { type: Number, default: 0 },
    subscriberCount: { type: Number, default: 0 },
    subscriptionFee: { type: Number, default: 0 },
    basePool: { type: Number, default: 0 },
    totalPool: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Draw", drawSchema);
