import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import speakeasy from "speakeasy";
import sendEmail from "../utils/sendEmail.js";
import { generateEmailTemplate } from "../utils/emailTemplates.js";
import qrcode from "qrcode";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP
  const saltOtp = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, saltOtp);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    otp: hashedOtp,
    emailVerificationExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
  });


  // Fire and forget email
  sendEmail({
    email: user.email,
    subject: "Task Manager - Email Verification",
    message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
    html: generateEmailTemplate(otp, "verification")
  }).catch(err => {
      console.error("❌ Background Email Error (Register):", err.message);
  });

  res.status(201).json({
    message: "Registration successful. Please verify your email with the OTP sent.",
    email: user.email,
  });

};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.status(401).json({
      message: "Please verify your email",
      errorCode: "EMAIL_NOT_VERIFIED",
      email: user.email,
    });
  }

  if (user && (await bcrypt.compare(password, user.password))) {

    // Check for 2FA
    if (user.is2FAEnabled) {
      
      if (user.twoFactorMethod === 'app') {
          return res.json({
            "2faRequired": true,
            method: 'app',
            email: user.email,
            message: "Enter code from Authenticator App"
          });
      }

      // Default to Email
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Hash OTP
      const salt = await bcrypt.genSalt(10);
      user.otp = await bcrypt.hash(otp, salt);
      user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();


      // Fire and forget email
      sendEmail({
        email: user.email,
        subject: "Task Manager - 2FA Code",
        message: `Your 2FA login code is: ${otp}`,
        html: generateEmailTemplate(otp, "2fa")
      }).catch(err => console.error("❌ Background Email Error (Login 2FA):", err.message));

      return res.json({
        "2faRequired": true,
        method: 'email',
        email: user.email,
        message: "2FA OTP sent to email"
      });

    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      is2FAEnabled: user.is2FAEnabled,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
// @desc Verify OTP
// @route POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Handle App Verification
  if (user.is2FAEnabled && user.twoFactorMethod === 'app') {
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret.base32,
      encoding: 'base32',
      token: otp
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid Authenticator Code" });
    }

    // Valid
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }

  // Handle Email Verification (Register Flow)
  if (!user.isVerified) {
    if (!user.otp || user.emailVerificationExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    console.log(`[VerifyOTP] User: ${email}, InputOTP: ${otp}, HashMatch: ${isMatch}`);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: "Email verified successfully"
    });
  }

  // Handle Login 2FA (Email)
  if (user.otp && user.emailVerificationExpire > Date.now()) {
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // Clear OTP
    user.otp = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }

  return res.status(400).json({ message: "Invalid request or OTP expired" });
};

// @desc Resend OTP
// @route POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);

  user.otp = hashedOtp;
  user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();


  sendEmail({
    email: user.email,
    subject: "Task Manager - New OTP",
    message: `Your new verification code is: ${otp}`,
    html: generateEmailTemplate(otp, "verification")
  }).catch(err => console.error("❌ Background Email Error (Resend OTP):", err.message));

  res.json({ message: "OTP resent successfully" });

};

// @desc Generate 2FA Secret (for App)
// @route POST /api/auth/2fa/generate
export const generate2FASecret = async (req, res) => {
  const user = await User.findById(req.user);

  const secret = speakeasy.generateSecret({
    length: 20,
    name: `Task Manager (${user.email})`
  });

  user.twoFactorSecret = secret;
  await user.save();

  // Generate QR Code Data URL
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res.status(500).json({ message: "Error generating QR Code" });
    }
    res.json({
      secret: secret.base32,
      qrCode: data_url
    });
  });
};

// @desc Enable 2FA (Verify and Save)
// @route POST /api/auth/2fa/enable
export const enable2FA = async (req, res) => {
  const { token, method } = req.body; // method: 'app' or 'email'
  const user = await User.findById(req.user);

  if (method === 'app') {
    if (!user.twoFactorSecret || !user.twoFactorSecret.base32) {
      return res.status(400).json({ message: "Please generate a secret first" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret.base32,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid Authenticator Code" });
    }

    user.is2FAEnabled = true;
    user.twoFactorMethod = 'app';
    await user.save();

    res.json({ message: "2FA (Authenticator App) Enabled Successfully" });

  } else if (method === 'email') {
    // For email, we assume they have access since they are logged in.
    // Ideally we re-verify, but for now we just switch.
    user.is2FAEnabled = true;
    user.twoFactorMethod = 'email';
    user.twoFactorSecret = undefined; // Clear app secret if switching
    await user.save();

    res.json({ message: "2FA (Email) Enabled Successfully" });
  } else {
    res.status(400).json({ message: "Invalid 2FA method" });
  }
};

// @desc Disable 2FA
// @route POST /api/auth/2fa/disable
export const disable2FA = async (req, res) => {
  const user = await User.findById(req.user);

  user.is2FAEnabled = false;
  user.twoFactorMethod = 'email'; // Reset to default
  user.twoFactorSecret = undefined;
  await user.save();

  res.json({ message: "2FA Disabled Successfully" });
};

// @desc Get current user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    is2FAEnabled: user.is2FAEnabled,
    twoFactorMethod: user.twoFactorMethod
  });
};
