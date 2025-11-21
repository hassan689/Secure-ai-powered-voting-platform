const express = require("express");
const { registerVoter, loginVoter, verifyOTP, resendOTP } = require("../controllers/authcontrol");
const router = express.Router();
router.post("/register", registerVoter);
router.post("/login", loginVoter);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;
