"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/generate", aiController_1.generateAIGradient);
router.post("/save", authMiddleware_1.protect, aiController_1.saveCreatedGradient);
router.get("/my-gradients", authMiddleware_1.protect, aiController_1.getCreatedGradients);
router.delete("/:id", authMiddleware_1.protect, aiController_1.deleteCreatedGradient);
exports.default = router;
