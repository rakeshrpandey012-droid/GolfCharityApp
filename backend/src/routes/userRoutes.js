const express = require("express");

const {
  getProfile,
  adminAnalytics,
  adminListUsers,
  adminUpdateUser,
  adminCreateUser,
  adminDeleteUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/analytics", protect, adminOnly, adminAnalytics);
router.get("/admin/users", protect, adminOnly, adminListUsers);
router.post("/admin/users", protect, adminOnly, adminCreateUser);
router.delete("/admin/users/:id", protect, adminOnly, adminDeleteUser);
router.patch("/admin/users/:id", protect, adminOnly, adminUpdateUser);

module.exports = router;
