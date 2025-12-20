import express from "express";
import {
    googleLogin,
    getMe,
    register,
    login,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updatePassword,
    toggleFavorite,
    resendVerification
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.put("/updatepassword", protect, updatePassword);
router.put("/toggle-favorite", protect, toggleFavorite);
router.post("/resend-verification", resendVerification);

router.post("/google", googleLogin);
router.get("/me", protect, getMe);

export default router;
