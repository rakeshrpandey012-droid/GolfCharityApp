const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: String, enum: ["monthly", "yearly"], required: true },
    stripeSessionId: { type: String, index: true },
    stripeCustomerId: { type: String },
    status: {
      type: String,
      enum: ["created", "active", "canceled", "expired", "payment_failed"],
      default: "created"
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    expiryDate: { type: Date, required: true },
    charityAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);