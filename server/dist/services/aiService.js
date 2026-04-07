"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGradient = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateGradient = async (prompt) => {
    const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    // Detect mode from prompt prefix
    const isEditMode = prompt.startsWith("[EDIT CURRENT GRADIENT]");
    const cleanPrompt = prompt
        .replace("[EDIT CURRENT GRADIENT] ", "")
        .replace("[GENERATE NEW GRADIENT] ", "")
        .trim();
    let fullPrompt;
    if (isEditMode) {
        fullPrompt = `
            You are a master digital artist and UI/UX expert. The user wants to refine their current gradient using procedural adjustments.
            Instruction: "${cleanPrompt}".
            
            Instead of just giving new hex codes, you must return adjustment parameters that will be applied to the existing base colors.
            
            First, explain your reasoning about what adjustments you are making in 2-3 short paragraphs.
            
            Then, output the adjusted gradient as a valid JSON object in this exact format:
            \`\`\`json
            {
                "name": "Adjusted Descriptive Title",
                "exposure": number (from -2.0 to 2.0, where 0.0 is neutral),
                "contrast": number (from 0.0 to 3.0, where 1.0 is neutral),
                "frequency": number (from 0.0 to 5.0, where 0.0 is neutral),
                "phase": number (from -3.14 to 3.14, where 0.0 is neutral),
                "type": "linear" | "radial" | "conic",
                "angle": number (0-360)
            }
            \`\`\`
            Note: Do NOT include a "colors" array in the JSON if you only want to use adjustments. If the user explicitly asks for totally different colors, you may include a new "colors" array.
            
            Requirements:
            1. Favor adjusting exposure (brightness), contrast, and frequency (color repetition) to achieve the mood.
            2. Your reasoning must come BEFORE the JSON block.
        `;
    }
    else {
        fullPrompt = `
            You are a master UI/UX designer and digital artist. Generate a sophisticated, modern CSS gradient based on this description: "${cleanPrompt}".
            
            First, explain your creative reasoning and thought process in 2-4 short paragraphs. Think about:
            - What colors and mood the user's prompt evokes
            - Why you chose specific color combinations
            - How the gradient type and angle complement the design intent

            Then, output the gradient as a valid JSON object in this exact format:
            \`\`\`json
            {
                "name": "Creative Descriptive Title",
                "colors": ["#hex1", "#hex2", ...],
                "type": "linear" | "radial" | "conic",
                "angle": number (only for linear, 0-360)
            }
            \`\`\`
            
            Requirements:
            1. Use harmonious, vibrant, and professional colors.
            2. Ensure the gradient is aesthetic and useful for high-end web projects.
            3. Your reasoning must come BEFORE the JSON block.
        `;
    }
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in environment variables");
        }
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Gemini Raw Response:", text);
            throw new Error("Invalid AI response format - No JSON found");
        }
        // Extract reasoning: everything before the JSON block
        const jsonStartIndex = text.indexOf(jsonMatch[0]);
        let reasoning = text.substring(0, jsonStartIndex).trim();
        // Clean up markdown fences from reasoning if present
        reasoning = reasoning.replace(/```json\s*$/m, "").trim();
        reasoning = reasoning.replace(/```\s*$/m, "").trim();
        const parsed = JSON.parse(jsonMatch[0]);
        // Basic validation - check for colors OR adjustments
        const hasColors = parsed.colors && Array.isArray(parsed.colors);
        const hasAdjustments = parsed.exposure !== undefined || parsed.contrast !== undefined;
        if (!hasColors && !hasAdjustments) {
            throw new Error("AI generated an invalid gradient - missing both colors and adjustments");
        }
        return {
            ...parsed,
            reasoning: reasoning || undefined,
        };
    }
    catch (error) {
        console.error("Gemini AI Error Detailed:", error);
        throw new Error(error.message || "Failed to generate gradient with AI");
    }
};
exports.generateGradient = generateGradient;
