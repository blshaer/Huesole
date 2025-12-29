"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SupportMessage_1 = __importDefault(require("../models/SupportMessage"));
const router = express_1.default.Router();
// @desc    Submit support message
// @route   POST /api/support
// @access  Public
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const newMessage = await SupportMessage_1.default.create({
            name,
            email,
            subject,
            message
        });
        res.status(201).json({ success: true, data: newMessage });
    }
    catch (error) {
        console.error("Support message error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.default = router;
