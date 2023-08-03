const express = require("express");
const router = express.Router();
const {
  getRequest,
  setRequest,
  updateRequest,
  deleteRequest,
} = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// router.get("/request", protect, getUserrequest); // 
router.get("/requests/:id", protect, getRequest); //
router.post("/requests", protect, setRequest);
router.put("/requests/:id", protect, restrictTo("admin"), updateRequest);
router.delete("/requests/:id", protect, restrictTo("admin"), deleteRequest);

module.exports = router;
