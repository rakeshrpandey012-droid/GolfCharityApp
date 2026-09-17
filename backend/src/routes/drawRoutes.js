const express = require("express");

const {
  runDraw,
  createDraft,
  simulateDraft,
  publishDraft,
  latestDraw,
  listDrawHistory
} = require("../controllers/drawController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/run", protect, adminOnly, runDraw);
router.post("/draft", protect, adminOnly, createDraft);
router.post("/:id/simulate", protect, adminOnly, simulateDraft);
router.post("/:id/publish", protect, adminOnly, publishDraft);
router.get("/latest", latestDraw);
router.get("/history", listDrawHistory);

module.exports = router;
