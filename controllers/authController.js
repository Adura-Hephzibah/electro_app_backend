const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const User = require("../models/userModel"); 

// @desc   Get user data
// @route  GET /api/v1/auth/me
// @access Private 
const getMe = asyncHandler(async (req, res) => {
  const { _id, username, role } = await User.findById(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      _id, 
      username,
      role,
    },
  });
});

// @desc   Get user data
// @route  GET /api/v1/auth/users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('region');
  res.status(200).json({
    status: "success",
    data: users,
  });
});

// @desc   Register new user
// @route  POST /api/v1/auth/register
// @access Private
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, password, passwordConfirm, role } = req.body;

  // validation
  if (!password || !passwordConfirm) {
    throw new AppError("Please add all fields!", 400);
  }

  // 1.) Check if user exists
  const userExists = await User.findOne({ username });

  if (userExists) {
    throw new AppError("User already exits!", 400);
  }

  // 2.) Create user
  const newUser = await User.create({
    username,
    password,
    passwordConfirm,
    role,
    apiKey: genAPIKey(),
  });

  if (newUser) {
    res.status(201).json({
      status: "Success",
      message: "User Created successfully",
      data: {
        user: newUser.username,
      },
    });
  } else {
    return next(new AppError("Invalid user data", 400));
  }
});

// @desc   Authenticate && Login user
// @route  POST /api/v1/auth/login
// @access Private
const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError("Please provide username and password!", 400);
  }

  // Check for user
  const user = await User.findOne({ username }).select("+password");

  // Check the password
  if (user && (await bcrypt.compare(password, user.password))) { 
    res.status(200).json({
      status: "Success",
      data: {
        user
      },
      token: generateToken(user._id),
    });
  } else {
    throw new AppError("Invalid credentials!", 400);
  }
});

// FUNCTIONS
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

//
const genAPIKey = () => {
  //  create a base-36 string that contains 30 chars in a-z,0-9
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join("");
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
};
