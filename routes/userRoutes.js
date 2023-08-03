const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../utils/asyncHandler')
const User = require('../models/userModel')
// const { getMe } = require("../controllers/authController");
const { protect } = require('../middlewares/authMiddleware')
const AppError = require("../utils/appError")

router.get(
  "/users/:id",
  protect,
  asyncHandler(async (req, res) => {
    const { _id, username, role } = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        _id,
        username,
        role,
      },
    });
  })
)

module.exports = router;
