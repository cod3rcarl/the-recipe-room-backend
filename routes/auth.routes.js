const express = require("express");
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout, googleController } = require("../controllers/auth.controller");

const router = express.Router();
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://the-recipe-room.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const { protect } = require("../middleware/auth");

router.post("/register", register);

router.post("/login", login);
router.get("/logout", logout);

router.post("/googlelogin", googleController);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

router.put("/updatedetails", updateDetails);
router.put("/updatepassword", updatePassword);

router.get("/me", protect, getMe);

module.exports = router;
