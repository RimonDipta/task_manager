import express from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getMe,
  generate2FASecret,
  enable2FA,
  disable2FA
} from "../controllers/authController.js";
import {
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/passwordController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

// 2FA Management
router.post("/2fa/generate", protect, generate2FASecret);
router.post("/2fa/enable", protect, enable2FA);
router.post("/2fa/disable", protect, disable2FA);

export default router;
