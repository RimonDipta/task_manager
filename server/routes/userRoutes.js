import express from "express";
import { updateUserProfile, deleteUserProfile, toggle2FA, setup2FA, verify2FASetup, uploadProfilePicture } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.put("/2fa", protect, toggle2FA);
router.post("/2fa/setup", protect, setup2FA);
router.post("/2fa/verify-setup", protect, verify2FASetup);

router.route("/profile")
    .put(protect, updateUserProfile)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserProfile);

router.post("/profile-picture", protect, upload.single("image"), uploadProfilePicture);

export default router;
