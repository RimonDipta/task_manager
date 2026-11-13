import User from "../models/User.js";
import bcrypt from "bcryptjs";

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
            profilePicture: updatedUser.profilePicture,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc Upload Profile Picture
// @route POST /api/users/profile-picture
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(req.user);
        if (user) {
            user.profilePicture = req.file.path; // Cloudinary URL
            await user.save();
            res.json({ 
                message: "Profile picture updated", 
                profilePicture: user.profilePicture 
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Image upload failed" });
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

// NOTE: 2FA setup/enable/disable is handled by authController.js
// (routes mounted at /api/auth/2fa/*). The toggle2FA/setup2FA/verify2FASetup
// functions that used to live here were dead code — never called by the
// frontend — and duplicated that flow with a divergent implementation.
// Removed during the Phase 1 audit cleanup to avoid two sources of truth.
