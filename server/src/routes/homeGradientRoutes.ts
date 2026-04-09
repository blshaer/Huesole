import express from "express";
import HomeGradient from "../models/HomeGradient";

const router = express.Router();

// @desc    Get all home gradients
// @route   GET /api/home-gradients
// @access  Public
router.get("/", async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : null;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : null;

        if (page && limit) {
            const skip = (page - 1) * limit;
            const total = await HomeGradient.countDocuments();
            const gradients = await HomeGradient.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return res.status(200).json({
                success: true,
                data: gradients,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        }

        // Default: return all for client-side filtering (HomePage)
        const gradients = await HomeGradient.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: gradients });
    } catch (error: any) {
        console.error("Home gradients error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch gradients from database", 
            error: error.message 
        });
    }
});

export default router;
