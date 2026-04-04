import { Request, Response } from "express";
import PageContent from "../models/PageContent";

// @desc    Get page content (Public)
// @route   GET /api/pages/:pageName
export const getPageContent = async (req: Request, res: Response) => {
    try {
        const { pageName } = req.params;
        const content = await PageContent.findOne({ pageName: pageName.toLowerCase() });

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
