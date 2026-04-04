import express from "express";
import { generateAIGradient, saveCreatedGradient, getCreatedGradients, deleteCreatedGradient } from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/generate", protect, generateAIGradient);
router.post("/save", protect, saveCreatedGradient);
router.get("/my-gradients", protect, getCreatedGradients);
router.delete("/:id", protect, deleteCreatedGradient);

export default router;
