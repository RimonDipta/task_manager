import User from "../models/User.js";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
// generateToken import removed as it is not used in update profile currently

// Wait, generateToken was inside authController. I should extract it or copy it.
// Checking authController again... it defined generateToken inside.
// I should duplicate it for now or Refactor later. Duplication is safer to avoid breaking authController.

// @desc Update user profile
// @route PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Password Update Logic
        if (req.body.password) {
            // Check if old password is provided
            if (!req.body.oldPassword) {
                return res.status(400).json({ message: "Please provide your current password" });
            }

            // Verify old password
            const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid current password" });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc Delete user profile
// @route DELETE /api/users/profile
export const deleteUserProfile = async (req, res) => {
    const user = await User.findById(req.user);

    if (user) {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required to delete account" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        await user.deleteOne();
        res.json({ message: "Account deleted successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc Toggle 2FA
// @route PUT /api/users/2fa
export const toggle2FA = async (req, res) => {
    const user = await User.findById(req.user);

    if (user) {
        user.is2FAEnabled = !user.is2FAEnabled;
        if (user.is2FAEnabled && !user.twoFactorMethod) {
            user.twoFactorMethod = 'email';
        }
        await user.save();
        res.json({
            is2FAEnabled: user.is2FAEnabled,
            message: `Two-Factor Authentication ${user.is2FAEnabled ? 'Enabled' : 'Disabled'}`
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc Generate 2FA Secret for App
// @route POST /api/users/2fa/setup
export const setup2FA = async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = speakeasy.generateSecret({
        name: `TaskManager (${user.email})`
    });

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.status(500).json({ message: "Error generating QR code" });

        res.json({
            secret: secret.base32,
            qrCode: data_url
        });
    });
};

// @desc Verify and Enable App 2FA
// @route POST /api/users/2fa/verify-setup
export const verify2FASetup = async (req, res) => {
    const { token, secret } = req.body;
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ message: "User not found" });

    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
    });

    if (verified) {
        user.is2FAEnabled = true;
        user.twoFactorMethod = 'app';
        user.twoFactorSecret = { base32: secret }; // Storing the secret
        await user.save();
        res.json({ message: "2FA Verified and Enabled", is2FAEnabled: true });
    } else {
        res.status(400).json({ message: "Invalid Authenticator Code" });
    }
};
