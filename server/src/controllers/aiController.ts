import { Request, Response } from "express";
import { generateGradient } from "../services/aiService";
import User from "../models/User";
import crypto from "crypto";

export const generateAIGradient = async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        const gradient = await generateGradient(prompt);
        res.status(200).json({ success: true, data: gradient });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const saveCreatedGradient = async (req: Request, res: Response) => {
    const { gradient } = req.body;
    // @ts-ignore
    const userId = req.user?.id;

    if (!gradient || !userId) {
        return res.status(400).json({ message: "Invalid request" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newGradient = {
            ...gradient,
            id: crypto.randomUUID(),
            createdAt: new Date(),
        };

        user.createdGradients.push(newGradient);

        // Sort by createdAt descending
        user.createdGradients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        await user.save();

        res.status(201).json({ success: true, data: user.createdGradients });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getCreatedGradients = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, data: user.createdGradients });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
