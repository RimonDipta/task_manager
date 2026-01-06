import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    is2FAEnabled: {
      type: Boolean,
      default: false,
    },

    twoFactorMethod: {
      type: String,
      enum: ["email", "app"],
      default: "email",
    },

    twoFactorSecret: {
      type: Object, // Stores { ascii, hex, base32, otpauth_url }
    },

    otp: String,
    emailVerificationExpire: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
