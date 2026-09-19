const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'running', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },

    // Draw Configuration
    scheduledDate: {
      type: Date,
      required: true,
    },
    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },
    numberOfWinners: {
      type: Number,
      default: null, // null means auto-calculate (10% of participants)
    },

    // Participants and Winners
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant',
      },
    ],
    winners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Winner',
      },
    ],

    // Charity Configuration
    charityIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Charity',
      },
    ],
    charityPercentage: {
      type: Number,
      default: 50, // Percentage of prize pool going to charity
      min: 0,
      max: 100,
    },

    // Execution Details
    executedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    algorithmVersion: {
      type: String,
      default: '1.0',
    },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    notes: {
      type: String,
    },
    tags: [String],

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
drawSchema.index({ status: 1, scheduledDate: 1 });
drawSchema.index({ createdAt: -1 });
drawSchema.index({ 'participants._id': 1 });

// Virtuals
drawSchema.virtual('participantCount').get(function () {
  return this.participants?.length || 0;
});

drawSchema.virtual('winnerCount').get(function () {
  return this.winners?.length || 0;
});

drawSchema.virtual('charityPayout').get(function () {
  return (this.prizePool * this.charityPercentage) / 100;
});

drawSchema.virtual('playerPayout').get(function () {
  return this.prizePool - this.charityPayout;
});

drawSchema.virtual('isExecuted').get(function () {
  return this.status === 'completed' || this.status === 'running';
});

drawSchema.virtual('isPending').get(function () {
  return this.status === 'active' || this.status === 'paused';
});

// Methods
drawSchema.methods.canExecute = function () {
  return (
    this.status === 'active' &&
    this.participants.length > 0 &&
    new Date() >= this.scheduledDate
  );
};

drawSchema.methods.getTotalDistributed = function () {
  return (this.winners || []).reduce((sum, winner) => {
    return sum + (winner.prizeAmount || 0);
  }, 0);
};

drawSchema.methods.getExecutionProgress = function () {
  if (this.status === 'completed') return 100;
  if (this.status === 'running') return 50;
  if (this.status === 'paused') return 25;
  return 0;
};

// Static methods
drawSchema.statics.getActiveDraws = function () {
  return this.find({ status: { $in: ['active', 'running'] } })
    .populate('participants')
    .sort({ scheduledDate: 1 });
};

drawSchema.statics.getCompletedDraws = function () {
  return this.find({ status: 'completed' })
    .populate('winners')
    .sort({ completedAt: -1 });
};

drawSchema.statics.getTotalPrizePoolByAdmin = function (adminId) {
  return this.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(adminId) } },
    { $group: { _id: null, total: { $sum: '$prizePool' } } },
  ]);
};

module.exports = mongoose.model('Draw', drawSchema);
