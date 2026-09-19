const express = require('express');
const router = express.Router();
const Draw = require('../models/Draw');
const Participant = require('../models/Participant');
const Winner = require('../models/Winner');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { executeDrawAlgorithm } = require('../utils/drawAlgorithm');

// Middleware
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all draws with stats
router.get('/draws', async (req, res) => {
  try {
    const draws = await Draw.find()
      .populate('participants')
      .populate('winners')
      .sort({ createdAt: -1 });

    res.json({ success: true, draws });
  } catch (error) {
    console.error('Error fetching draws:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch draws' });
  }
});

// Get draw statistics
router.get('/draws/stats', async (req, res) => {
  try {
    const totalDraws = await Draw.countDocuments();
    const activeDraw = await Draw.countDocuments({ status: 'active' });
    const completedDraws = await Draw.countDocuments({ status: 'completed' });
    
    const draws = await Draw.find();
    const totalPrizePool = draws.reduce((sum, draw) => sum + (draw.prizePool || 0), 0);

    res.json({
      success: true,
      totalDraws,
      activeDraw,
      completedDraws,
      totalPrizePool,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// Get single draw
router.get('/draws/:id', async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id)
      .populate('participants')
      .populate('winners');

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    res.json({ success: true, draw });
  } catch (error) {
    console.error('Error fetching draw:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch draw' });
  }
});

// Create new draw
router.post('/draws', async (req, res) => {
  try {
    const { name, description, scheduledDate, prizePool, participants, charityIds } = req.body;

    const draw = new Draw({
      name,
      description,
      scheduledDate,
      prizePool,
      participants,
      charityIds,
      status: 'active',
      createdBy: req.user._id,
    });

    await draw.save();
    res.status(201).json({ success: true, draw });
  } catch (error) {
    console.error('Error creating draw:', error);
    res.status(500).json({ success: false, message: 'Failed to create draw' });
  }
});

// Update draw
router.patch('/draws/:id', async (req, res) => {
  try {
    const { name, description, scheduledDate, prizePool, participants } = req.body;

    const draw = await Draw.findByIdAndUpdate(
      req.params.id,
      { name, description, scheduledDate, prizePool, participants },
      { new: true }
    ).populate('participants').populate('winners');

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    res.json({ success: true, draw });
  } catch (error) {
    console.error('Error updating draw:', error);
    res.status(500).json({ success: false, message: 'Failed to update draw' });
  }
});

// Update draw status
router.patch('/draws/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'paused', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const draw = await Draw.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    res.json({ success: true, draw, message: `Draw ${status} successfully` });
  } catch (error) {
    console.error('Error updating draw status:', error);
    res.status(500).json({ success: false, message: 'Failed to update draw status' });
  }
});

// Delete draw
router.delete('/draws/:id', async (req, res) => {
  try {
    const draw = await Draw.findByIdAndDelete(req.params.id);

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    res.json({ success: true, message: 'Draw deleted successfully' });
  } catch (error) {
    console.error('Error deleting draw:', error);
    res.status(500).json({ success: false, message: 'Failed to delete draw' });
  }
});

// Execute draw engine
router.post('/draws/:id/execute', async (req, res) => {
  try {
    const { action } = req.body;
    const draw = await Draw.findById(req.params.id).populate('participants');

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    if (action === 'start') {
      // Validate draw has participants
      if (!draw.participants || draw.participants.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot execute draw with no participants',
        });
      }

      // Mark as running
      draw.status = 'running';
      await draw.save();

      res.json({ success: true, message: 'Draw execution started' });
    } else if (action === 'pause') {
      draw.status = 'paused';
      await draw.save();
      res.json({ success: true, message: 'Draw paused' });
    } else if (action === 'resume') {
      draw.status = 'running';
      await draw.save();
      res.json({ success: true, message: 'Draw resumed' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error executing draw:', error);
    res.status(500).json({ success: false, message: 'Failed to execute draw' });
  }
});

// Confirm winners
router.post('/draws/:id/confirm-winners', async (req, res) => {
  try {
    const { winners } = req.body;
    const draw = await Draw.findById(req.params.id);

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    // Save winners
    const savedWinners = await Winner.insertMany(
      winners.map(winner => ({
        ...winner,
        drawId: req.params.id,
        confirmedAt: new Date(),
      }))
    );

    // Update draw
    draw.winners = savedWinners.map(w => w._id);
    draw.status = 'completed';
    draw.completedAt = new Date();
    await draw.save();

    res.json({
      success: true,
      message: 'Winners confirmed successfully',
      winners: savedWinners,
    });
  } catch (error) {
    console.error('Error confirming winners:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm winners' });
  }
});

module.exports = router;
