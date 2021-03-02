const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/auth.model");
const config = require("../config/config");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  let id;

  if (req.cookies) {
    token = req.cookies.token;
  }
  if (req.body.user) {
    id = req.body.user._id;
  }
  if (req.params) {
    id = req.params.id;
  }

  if (!token && !id) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
    if (id) {
      req.user = await User.findById(id);
    }
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to access this route`, 403));
    }
    next();
  };
};
