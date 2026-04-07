"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCreatedGradient = exports.getCreatedGradients = exports.saveCreatedGradient = exports.generateAIGradient = void 0;
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
        const is503 = error.message?.includes("503") || error.status === 503;
        const statusCode = is503 ? 503 : 500;
        res.status(statusCode).json({ message: error.message });
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
        const gradientId = gradient.id || crypto_1.default.randomUUID();
        const newGradient = {
            ...gradient,
            id: gradientId,
            createdAt: new Date(),
        };
        const existingIndex = user.createdGradients.findIndex((g) => g.id === gradientId);
        if (existingIndex === -1) {
            user.createdGradients.push(newGradient);
        }
        else {
            // Update existing entry
            user.createdGradients[existingIndex] = newGradient;
        }
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
        // Ensure every gradient has an 'id' for the frontend even if it only has '_id'
        const gradients = user.createdGradients.map((g) => ({
            id: g.id || g._id.toString(),
            name: g.name,
            colors: g.colors,
            type: g.type,
            angle: g.angle,
            exposure: g.exposure,
            contrast: g.contrast,
            frequency: g.frequency,
            phase: g.phase,
            steps: g.steps,
            createdAt: g.createdAt
        }));
        res.status(200).json({ success: true, data: gradients });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getCreatedGradients = getCreatedGradients;
const deleteCreatedGradient = async (req, res) => {
    // @ts-ignore
    const userId = req.user?.id;
    const { id } = req.params;
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Filter out the gradient checking both 'id' and '_id' to be safe
        const originalCount = user.createdGradients.length;
        user.createdGradients = user.createdGradients.filter((g) => g.id !== id && g._id.toString() !== id);
        if (user.createdGradients.length === originalCount) {
            console.log(`No gradient found with ID: ${id} for user: ${userId}`);
        }
        await user.save();
        // Return the updated list in the same format as getCreatedGradients
        const gradients = user.createdGradients.map((g) => ({
            id: g.id || g._id.toString(),
            name: g.name,
            colors: g.colors,
            type: g.type,
            angle: g.angle,
            exposure: g.exposure,
            contrast: g.contrast,
            frequency: g.frequency,
            phase: g.phase,
            steps: g.steps,
            createdAt: g.createdAt
        }));
        res.status(200).json({ success: true, data: gradients });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteCreatedGradient = deleteCreatedGradient;
