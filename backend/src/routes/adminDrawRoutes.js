// backend/src/routes/adminDrawRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const Draw = require('../models/Draw');

const router = express.Router();

// List all draws (admin view)
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const draws = await Draw.find().sort({ month: -1, createdAt: -1 });
    res.json({ draws });
  } catch (err) {
    next(err);
  }
});

// Stats for dashboard cards
router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const totalDraws = await Draw.countDocuments();
    const activeDraw = await Draw.countDocuments({ status: 'active' });
    const completedDraws = await Draw.countDocuments({ status: 'published' });
    const prizeAgg = await Draw.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPool' } } }
    ]);
    const totalPrizePool = prizeAgg[0]?.total || 0;

    res.json({ totalDraws, activeDraw, completedDraws, totalPrizePool });
  } catch (err) {
    next(err);
  }
});

// Update draw status (pause/resume)
router.patch('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await Draw.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Draw not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a draw
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Draw.findByIdAndDelete(req.params.id);
    res.json({ message: 'Draw deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
