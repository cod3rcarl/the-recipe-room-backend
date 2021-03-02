const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const config = "../config/config.js";

const { OAuth2Client } = require("google-auth-library");

const User = require("../models/auth.model");

// @description register user
// @route POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });
  sendTokenResponse(user, 200, res);
});

// @description register user
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  console.log(res);
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response

// @description Get current logged in user
// @route POST /api/v1/auth/me
// @access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description Log user out / clear cookie
// @route GET /api/v1/auth/logout
// @access Private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @description Update user details
// @route POST /api/v1/auth/updatedetails
// @access Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.newName,
    email: req.body.newEmail,
  };
  const user = await User.findByIdAndUpdate(req.body.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description Update Password
// @route PUT /api/v1/auth/updatepassword

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id).select("+password");

  // check current password

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
// @description Forgot Password
// @route POST /api/v1/auth/forgotpassword
// @access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url

  const resetUrl = `http://localhost:3000/users/password/reset/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password.  Click the link to reset your password \n\n ${resetUrl}`;

  try {
    await sendEmail({
      subject: "Password reset token",
      text: message,
      to: user.email,
      from: config.GOOGLE_EMAIL,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent: ${err}`, 500));
  }

  //res.end();
});

// @description Reset Password
// @route PUT /api/v1/auth/resetpassword/:resettoken
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token"), 400);
  }

  //Set new password

  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user,
      message: "Success ... Please Wait ...",
    });
};

const client = new OAuth2Client(config.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;

  client.verifyIdToken({ idToken, audience: config.GOOGLE_CLIENT }).then((response) => {
    const { email_verified, name, email } = response.payload;
    if (email_verified) {
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = user.getSignedJwtToken();
          const { _id, email, name, role } = user;
          return res.json({
            token,
            user: { _id, email, name, role },
          });
        } else {
          let password = email + config.JWT_SECRET;
          user = new User({ name, email, password });
          user.save((err, data) => {
            if (err) {
              return res.status(400).json({
                error: "User signup failed with google",
              });
            }
            const token = user.getSignedJwtToken();
            const { _id, email, name, role } = data;
            return res.json({
              token,
              user: { _id, email, name, role },
              messaage: "Logged in with Google",
            });
          });
        }
      });
    } else {
      return res.status(400).json({
        error: "Google login failed. Try again",
      });
    }
  });
};
