import express from "express";
import SupportMessage from "../models/SupportMessage";

const router = express.Router();

// @desc    Submit support message
// @route   POST /api/support
// @access  Public
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newMessage = await SupportMessage.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Support message error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
