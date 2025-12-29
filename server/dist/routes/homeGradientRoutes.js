"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HomeGradient_1 = __importDefault(require("../models/HomeGradient"));
const router = express_1.default.Router();
// @desc    Get all home gradients
// @route   GET /api/home-gradients
// @access  Public
router.get("/", async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : null;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        if (page && limit) {
            const skip = (page - 1) * limit;
            const total = await HomeGradient_1.default.countDocuments();
            const gradients = await HomeGradient_1.default.find({})
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
        const gradients = await HomeGradient_1.default.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: gradients });
    }
    catch (error) {
        console.error("Home gradients error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.default = router;
