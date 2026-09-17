const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    score: { type: Number, required: true, min: 1, max: 45 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

scoreSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Score", scoreSchema);