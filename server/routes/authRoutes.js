import express from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getMe,
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

export default router;
