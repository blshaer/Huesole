"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGradient = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateGradient = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const fullPrompt = `
        You are a master UI/UX designer and digital artist. Generate a sophisticated, modern CSS gradient based on this description: "${prompt}".
        
        Requirements:
        1. Use harmonious, vibrant, and professional colors.
        2. Ensure the gradient is aesthetic and useful for high-end web projects.
        3. Respond ONLY with a valid JSON object in this format:
        {
            "name": "Creative Descriptive Title",
            "colors": ["#hex1", "#hex2", ...],
            "type": "linear" | "radial" | "conic",
            "angle": number (only for linear, 0-360)
        }
    `;
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in environment variables");
        }
        const result = yield model.generateContent(fullPrompt);
        const response = yield result.response;
        const text = response.text();
        // Clean up the response in case Gemini adds markdown backticks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Gemini Raw Response:", text);
            throw new Error("Invalid AI response format - No JSON found");
        }
        const parsed = JSON.parse(jsonMatch[0]);
        // Basic validation of the parsed object
        if (!parsed.colors || !Array.isArray(parsed.colors)) {
            throw new Error("AI generated an invalid gradient (missing colors)");
        }
        return parsed;
    }
    catch (error) {
        console.error("Gemini AI Error Detailed:", error);
        throw new Error(error.message || "Failed to generate gradient with AI");
    }
});
exports.generateGradient = generateGradient;
