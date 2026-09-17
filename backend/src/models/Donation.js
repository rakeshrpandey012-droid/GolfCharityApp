const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    charity: { type: mongoose.Schema.Types.ObjectId, ref: "Charity", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "usd" },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
