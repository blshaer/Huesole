import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export interface GeneratedGradient {
    name: string;
    colors: string[];
    type: "linear" | "radial" | "conic";
    angle?: number;
}

export const generateGradient = async (prompt: string): Promise<GeneratedGradient> => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
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

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
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
    } catch (error: any) {
        console.error("Gemini AI Error Detailed:", error);
        throw new Error(error.message || "Failed to generate gradient with AI");
    }
};
