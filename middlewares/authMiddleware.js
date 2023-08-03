const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const db = require("../config/db");

//

const protect = asyncHandler(async (req, res, next) => {
  const authHeading = req.get("Authorization");
  // const { apiKey } = req.body;
  const apiKey = req.headers?.apikey;
  const token = authHeading?.split(" ")[1];
  let decoded;

  console.log('reqHeaders', req.headers)
 
  if (!authHeading) {
    return next(new AppError("A valid token is needed to gain access!", 401));
  }

  if (!apiKey) {
    return next(new AppError("A valid apiKey is needed to gain access!", 401));
  }

  if (req.headers.authorization) {
    // const authHeading = req.get("Authorization");
    // console.log(authHeading);

    //   verify token
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!decoded) {
      return next(new AppError("Invalid token", 401));
    }

    // Check if user has not been deleted.
    if (!req.user) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }
  } else {
    return next(new AppError("Please login to access this route", 401));
  }

  // Check if apikey provided matches apiKey in db
  const findApiKey = await User.findOne({ apiKey: apiKey });

  // If it doesn't match any apiKey in db
  if (!findApiKey || findApiKey === null) {
    return next(new AppError("apiKey is Invalid!", 401));
  }

  // Check if it matches apiKey of currently logged in user

  decoded = jwt.verify(token, process.env.JWT_SECRET);
  const myUser = await User.findById(decoded.id).select("-password");

  if (myUser.apiKey !== apiKey) {
    return next(
      new AppError("apiKey doesn't match the apiKey for logged in user", 401)
    );
  }
  // Grant Access
  next();
});

const restrictTo = (...role) => {
  return (req, res, next) => {
    if (!userType.includes(req.user?.role)) {
      return next(
        new AppError("You dont have permission to perform this action", 403)
      );
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
