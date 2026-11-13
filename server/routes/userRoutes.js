import express from "express";
import { updateUserProfile, deleteUserProfile, uploadProfilePicture } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Note: 2FA setup/enable/disable lives under /api/auth/2fa/* (see authRoutes.js).
// The old /api/users/2fa/* endpoints below were dead code never called by the
// frontend and duplicated that logic with a divergent implementation — removed.

router.route("/profile")
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserProfile);

router.post("/profile-picture", protect, upload.single("image"), uploadProfilePicture);

export default router;
