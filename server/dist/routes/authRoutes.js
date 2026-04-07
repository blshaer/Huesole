"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Multer Config
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error("Images only!"));
    }
}
const upload = (0, multer_1.default)({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/forgot-password", authController_1.forgotPassword);
router.put("/reset-password/:token", authController_1.resetPassword);
router.get("/verify-email/:token", authController_1.verifyEmail);
router.put("/updatepassword", authMiddleware_1.protect, authController_1.updatePassword);
router.put("/toggle-favorite", authMiddleware_1.protect, authController_1.toggleFavorite);
router.put("/toggle-dislike", authMiddleware_1.protect, authController_1.toggleDislike);
router.put("/update-profile", authMiddleware_1.protect, upload.single("picture"), authController_1.updateProfile);
router.post("/resend-verification", authController_1.resendVerification);
router.post("/google", authController_1.googleLogin);
router.get("/me", authMiddleware_1.protect, authController_1.getMe);
router.delete("/delete-account", authMiddleware_1.protect, authController_1.deleteAccount);
exports.default = router;
