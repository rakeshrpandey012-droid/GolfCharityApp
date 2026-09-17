const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    events: [{ type: String }],
    isSpotlight: { type: Boolean, default: false },
    totalDonations: { type: Number, default: 0 }
  },
  { timestamps: true }
);

charitySchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Charity", charitySchema);
