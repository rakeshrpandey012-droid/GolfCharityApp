const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema(
  {
    // Draw Reference
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draw',
      required: true,
      index: true,
    },

    // Participant Information
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
      required: true,
    },
    participantName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },

    // Prize Information
    prizeAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    rank: {
      type: Number,
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },

    // Score Components
    scoreComponents: {
      performance: Number,
      participation: Number,
      charity: Number,
      engagement: Number,
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'verified', 'claimed', 'paid'],
      default: 'pending',
      index: true,
    },
    verificationCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    claimedAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },

    // Payment Details
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'stripe', 'charity_donation'],
    },
    bankDetails: {
      accountHolder: String,
      sortCode: String,
      accountNumber: String,
      bankName: String,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Communication
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notificationSentAt: {
      type: Date,
    },
    announcements: {
      type: Number,
      default: 0,
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    verifiedAt: {
      type: Date,
    },
    verificationNotes: {
      type: String,
    },

    // Metadata
    notes: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
winnerSchema.index({ drawId: 1, rank: 1 });
winnerSchema.index({ participantId: 1 });
winnerSchema.index({ email: 1 });
winnerSchema.index({ status: 1, createdAt: -1 });

// Virtuals
winnerSchema.virtual('isPending').get(function () {
  return this.status === 'pending';
});

winnerSchema.virtual('isVerified').get(function () {
  return this.status === 'verified' || this.status === 'claimed' || this.status === 'paid';
});

winnerSchema.virtual('isPaid').get(function () {
  return this.status === 'paid';
});

// Methods
winnerSchema.methods.verify = async function (adminId, notes = '') {
  this.isVerified = true;
  this.verifiedBy = adminId;
  this.verifiedAt = new Date();
  this.status = 'verified';
  this.verificationNotes = notes;
  return this.save();
};

winnerSchema.methods.markAsClaimed = async function () {
  this.status = 'claimed';
  this.claimedAt = new Date();
  return this.save();
};

winnerSchema.methods.markAsPaid = async function (transactionId = null) {
  this.status = 'paid';
  this.paidAt = new Date();
  if (transactionId) {
    this.transactionId = transactionId;
  }
  return this.save();
};

winnerSchema.methods.sendNotification = async function () {
  this.notificationSent = true;
  this.notificationSentAt = new Date();
  this.announcements += 1;
  return this.save();
};

winnerSchema.methods.generateVerificationCode = function () {
  const code = `WIN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  this.verificationCode = code;
  return code;
};

// Static methods
winnerSchema.statics.getWinnersByDraw = function (drawId) {
  return this.find({ drawId })
    .populate('participantId')
    .sort({ rank: 1 });
};

winnerSchema.statics.getUnverifiedWinners = function () {
  return this.find({ status: 'pending' })
    .populate('drawId')
    .populate('participantId')
    .sort({ createdAt: -1 });
};

winnerSchema.statics.getPendingPayments = function () {
  return this.find({ status: { $in: ['verified', 'claimed'] } })
    .populate('drawId')
    .sort({ createdAt: 1 });
};

winnerSchema.statics.getTotalWinnings = function (participantId) {
  return this.aggregate([
    { $match: { participantId: mongoose.Types.ObjectId(participantId), status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$prizeAmount' } } },
  ]);
};

winnerSchema.statics.getWinnerStats = function (drawId) {
  return this.aggregate([
    { $match: { drawId: mongoose.Types.ObjectId(drawId) } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalPayout: { $sum: '$prizeAmount' },
        averageScore: { $avg: '$score' },
        verified: {
          $sum: { $cond: [{ $eq: ['$status', 'verified'] }, 1, 0] },
        },
        paid: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
      },
    },
  ]);
};

module.exports = mongoose.model('Winner', winnerSchema);
