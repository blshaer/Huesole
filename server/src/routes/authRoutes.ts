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
    resendVerification,
    updateProfile,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Images only!"));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.put("/updatepassword", protect, updatePassword);
router.put("/toggle-favorite", protect, toggleFavorite);
router.put("/update-profile", protect, upload.single("picture"), updateProfile);
router.post("/resend-verification", resendVerification);

router.post("/google", googleLogin);
router.get("/me", protect, getMe);

export default router;
