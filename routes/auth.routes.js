const express = require("express");
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout, googleController } = require("../controllers/auth.controller");

const router = express.Router();

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
