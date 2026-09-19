const { z } = require("zod");

const Charity = require("../models/Charity");
const User = require("../models/User");
const Donation = require("../models/Donation");
const AppError = require("../utils/AppError");

const DEFAULT_CHARITIES = [
  {
    name: "First Tee Youth Golf",
    description: "Helping young people build life skills through golf.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b",
    isSpotlight: true
  },
  {
    name: "Clean Water Global",
    description: "Funding clean water projects in underserved communities.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    isSpotlight: false
  },
  {
    name: "Children Cancer Support",
    description: "Supporting treatment and family care for children with cancer.",
    image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f",
    isSpotlight: true
  },
  {
    name: "World Wildlife Fund",
    description: "Conserving nature and reducing the most pressing threats to the diversity of life on Earth.",
    image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def",
    isSpotlight: false
  }
];

const createCharitySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().url().optional(),
  events: z.array(z.string().min(2)).optional(),
  isSpotlight: z.boolean().optional(),
  spotlight: z.boolean().optional()
});

const updateCharitySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  events: z.array(z.string().min(2)).optional(),
  isSpotlight: z.boolean().optional(),
  spotlight: z.boolean().optional()
});

const selectCharitySchema = z.object({
  charityId: z.string().min(1),
  charityPercentage: z.number().min(10).max(100).optional(),
  contributionPercentage: z.number().min(10).max(100).optional()
});

const independentDonationSchema = z.object({
  amount: z.number().positive(),
  note: z.string().max(500).optional()
});

async function listCharities(req, res, next) {
  try {
    const q = (req.query.q || "").trim();
    const spotlight = req.query.spotlight;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (spotlight === "true") {
      filter.isSpotlight = true;
    }

    let charities = await Charity.find(filter).sort({ isSpotlight: -1, createdAt: -1 });

    if (charities.length === 0 && !q && spotlight !== "true") {
      await Charity.insertMany(DEFAULT_CHARITIES);
      charities = await Charity.find(filter).sort({ isSpotlight: -1, createdAt: -1 });
    }

    res.status(200).json({ charities });
  } catch (error) {
    next(error);
  }
}

async function createCharity(req, res, next) {
  try {
    const payload = createCharitySchema.parse(req.body);
    const charity = await Charity.create({
      ...payload,
      isSpotlight: payload.isSpotlight ?? payload.spotlight ?? false
    });
    res.status(201).json({ charity });
  } catch (error) {
    next(error);
  }
}

async function selectCharity(req, res, next) {
  try {
    if (req.user.subscriptionStatus !== "active" && !req.activeSubscription) {
      throw new AppError("Active subscription required to choose a charity", 403);
    }

    const { charityId, charityPercentage, contributionPercentage } = selectCharitySchema.parse(req.body);
    const charity = await Charity.findById(charityId);

    if (!charity) {
      throw new AppError("Charity not found", 404);
    }

    const percentage = charityPercentage ?? contributionPercentage ?? 10;

    await User.findByIdAndUpdate(req.user._id, {
      charity: charity._id,
      charityPercentage: percentage
    });

    res.status(200).json({ message: "Charity preference updated" });
  } catch (error) {
    next(error);
  }
}

async function updateCharity(req, res, next) {
  try {
    const payload = updateCharitySchema.parse(req.body);
    const charity = await Charity.findByIdAndUpdate(req.params.id, {
      ...payload,
      isSpotlight: payload.isSpotlight ?? payload.spotlight ?? false
    }, {
      new: true,
      runValidators: true
    });

    if (!charity) {
      throw new AppError("Charity not found", 404);
    }

    res.status(200).json({ charity });
  } catch (error) {
    next(error);
  }
}

async function deleteCharity(req, res, next) {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) {
      throw new AppError("Charity not found", 404);
    }

    res.status(200).json({ message: "Charity deleted" });
  } catch (error) {
    next(error);
  }
}

async function donateToCharity(req, res, next) {
  try {
    if (req.user.subscriptionStatus !== "active" && !req.activeSubscription) {
      throw new AppError("Active subscription required to donate", 403);
    }

    const { amount, note } = independentDonationSchema.parse(req.body);
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      throw new AppError("Charity not found", 404);
    }

    const donation = await Donation.create({
      user: req.user._id,
      charity: charity._id,
      amount,
      note
    });

    charity.totalDonations = Number((charity.totalDonations + amount).toFixed(2));
    await charity.save();

    res.status(201).json({ donation });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCharities,
  createCharity,
  selectCharity,
  updateCharity,
  deleteCharity,
  donateToCharity
};
