import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { generateEmailTemplate } from "../utils/emailTemplates.js";
import jwt from "jsonwebtoken";

// @desc Forgot password - Send OTP
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP and save to resetPasswordToken field (to distinguish from main otp field)
  // We use the same field name but treat it as an OTP store
  const salt = await bcrypt.genSalt(10);
  user.resetPasswordToken = await bcrypt.hash(otp, salt);
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: "Task Manager - Password Reset OTP",
      message: `Your password reset code is: ${otp}`,
      html: generateEmailTemplate(otp, "reset") // Assumption: template 'reset' exists or falls back
    });

    res.json({ message: "Password reset OTP sent to email" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(500).json({ message: "Email could not be sent" });
  }
};

// @desc Verify Reset OTP
// @route POST /api/auth/verify-reset-otp
export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user || !user.resetPasswordToken) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const isMatch = await bcrypt.compare(otp, user.resetPasswordToken);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP Valid. Generate a short-lived token to allow password change
  // This prevents user from skipping OTP step
  const resetToken = jwt.sign({ id: user._id, type: 'reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });

  res.json({ message: "OTP Verified", resetToken });
};

// @desc Reset password
// @route POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { resetToken, password } = req.body;

  if (!resetToken) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    if (decoded.type !== 'reset') {
      return res.status(401).json({ message: "Invalid token type" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
