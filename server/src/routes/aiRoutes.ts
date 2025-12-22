import express from "express";
import { generateAIGradient, saveCreatedGradient, getCreatedGradients } from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/generate", generateAIGradient);
router.post("/save", protect, saveCreatedGradient);
router.get("/my-gradients", protect, getCreatedGradients);

export default router;
