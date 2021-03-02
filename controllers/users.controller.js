const asyncHandler = require("../middleware/async");
const User = require("../models/auth.model");

// @description Get all users
// @route GET /api/v1/users
// @access Private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  console.log(res);
  res.status(200).json(res.advancedResults);
});

// @description Get single
// @route GET/api/v1/users:/id
// @access Private/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ user: user });
});

// @description Update user
// @route PUT  /api/v1/users/:id
// @access Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ user: user });
});

// @description Delete user
// @route DELETE  /api/v1/users/:id
// @access Private/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Account deleted",
  });
});
