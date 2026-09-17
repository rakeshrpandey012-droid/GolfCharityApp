const { z } = require("zod");

const Winner = require("../models/Winner");
const AppError = require("../utils/AppError");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const proofSchema = z.object({
  winnerId: z.string().min(1),
  proofImageUrl: z.string().url().optional()
});

const reviewSchema = z.object({
  status: z.enum(["approved", "rejected", "paid"])
});

async function listWinners(req, res, next) {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user._id };
    const winners = await Winner.find(query)
      .populate("user", "name email")
      .populate("draw", "month numbers type status")
      .sort({ createdAt: -1 });

    res.status(200).json({ winners });
  } catch (error) {
    next(error);
  }
}

async function uploadProof(req, res, next) {
  try {
    const { winnerId, proofImageUrl } = proofSchema.parse(req.body);
    const winner = await Winner.findById(winnerId);

    if (!winner) {
      throw new AppError("Winner record not found", 404);
    }

    if (String(winner.user) !== String(req.user._id)) {
      throw new AppError("Not allowed", 403);
    }

    let uploadedUrl = null;
    if (req.file) {
      if (!isCloudinaryConfigured) {
        throw new AppError("Cloudinary is not configured", 500);
      }

      const base64 = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "golf-platform/winner-proofs",
        resource_type: "image"
      });
      uploadedUrl = uploadResult.secure_url;
    }

    const proofImage = uploadedUrl || proofImageUrl;
    if (!proofImage) {
      throw new AppError("Provide proofImage file or proofImageUrl", 400);
    }

    winner.proofImage = proofImage;
    winner.status = "pending";
    await winner.save();

    res.status(200).json({ winner });
  } catch (error) {
    next(error);
  }
}

async function reviewWinner(req, res, next) {
  try {
    const { status } = reviewSchema.parse(req.body);
    const winner = await Winner.findById(req.params.id);

    if (!winner) {
      throw new AppError("Winner not found", 404);
    }

    winner.status = status;
    await winner.save();

    res.status(200).json({ winner });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listWinners,
  uploadProof,
  reviewWinner
};
