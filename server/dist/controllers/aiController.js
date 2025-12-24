"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatedGradients = exports.saveCreatedGradient = exports.generateAIGradient = void 0;
const aiService_1 = require("../services/aiService");
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const generateAIGradient = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }
    try {
        const gradient = await (0, aiService_1.generateGradient)(prompt);
        res.status(200).json({ success: true, data: gradient });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.generateAIGradient = generateAIGradient;
const saveCreatedGradient = async (req, res) => {
    const { gradient } = req.body;
    // @ts-ignore
    const userId = req.user?.id;
    if (!gradient || !userId) {
        return res.status(400).json({ message: "Invalid request" });
    }
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newGradient = {
            ...gradient,
            id: crypto_1.default.randomUUID(),
            createdAt: new Date(),
        };
        user.createdGradients.push(newGradient);
        // Sort by createdAt descending
        user.createdGradients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        await user.save();
        res.status(201).json({ success: true, data: user.createdGradients });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.saveCreatedGradient = saveCreatedGradient;
const getCreatedGradients = async (req, res) => {
    // @ts-ignore
    const userId = req.user?.id;
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, data: user.createdGradients });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getCreatedGradients = getCreatedGradients;
