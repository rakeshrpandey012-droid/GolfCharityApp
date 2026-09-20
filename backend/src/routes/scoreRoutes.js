const express = require("express");

const { createScore, listScores, updateMyScore, adminUpdateScore, deleteScore, adminDeleteScore } = require("../controllers/scoreController");
const { protect } = require("../middlewares/authMiddleware");
const { checkActiveSubscription } = require("../middlewares/subscriptionMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", protect, checkActiveSubscription, createScore);
router.get("/", protect, listScores);
router.patch("/admin/:id", protect, adminOnly, adminUpdateScore);
router.delete("/admin/:id", protect, adminOnly, adminDeleteScore);
router.patch("/:id", protect, checkActiveSubscription, updateMyScore);
router.delete("/:id", protect, checkActiveSubscription, deleteScore);

module.exports = router;
