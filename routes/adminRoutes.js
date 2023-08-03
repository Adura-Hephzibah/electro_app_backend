const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Region = require("../models/regionModel");
const { getAllUsers } = require("../controllers/authController");
const {
  getAllRegions,
  getAllRequests,
  updateUser,
} = require("../controllers/adminController");

const { protect } = require("../middlewares/authMiddleware");

// Get ALL USERS
router.get("/users", protect, getAllUsers);

router.patch("/users/:id", protect, updateUser);

router.get("/regions", protect, getAllRegions);

router.get("/requests", protect, getAllRequests);



module.exports = router;
