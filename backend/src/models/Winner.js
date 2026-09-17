const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    draw: { type: mongoose.Schema.Types.ObjectId, ref: "Draw", required: true, index: true },
    matchType: { type: String, enum: ["3", "4", "5"], required: true },
    prizeAmount: { type: Number, default: 0 },
    proofImage: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending"
    }
  },
  { timestamps: true }
);

winnerSchema.index({ draw: 1, matchType: 1 });

module.exports = mongoose.model("Winner", winnerSchema);