import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export interface GeneratedGradient {
    name: string;
    colors: string[];
    type: "linear" | "radial" | "conic";
    angle?: number;
    reasoning?: string;
}

export const generateGradient = async (prompt: string): Promise<GeneratedGradient> => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Detect mode from prompt prefix
    const isEditMode = prompt.startsWith("[EDIT CURRENT GRADIENT]");
    const cleanPrompt = prompt
        .replace("[EDIT CURRENT GRADIENT] ", "")
        .replace("[GENERATE NEW GRADIENT] ", "")
        .trim();

    let fullPrompt: string;

    if (isEditMode) {
        fullPrompt = `
            You are a master UI/UX designer helping a user refine their existing gradient. The user wants to edit their current gradient with this instruction: "${cleanPrompt}".
            
            First, explain your reasoning about what adjustments you are making in 2-3 short paragraphs. Think about:
            - What specific adjustments (exposure, contrast, saturation, hue shifts) the user's request implies
            - How you are modifying the existing colors rather than creating entirely new ones
            - The visual impact of your adjustments

            Then, output the adjusted gradient as a valid JSON object in this exact format:
            \`\`\`json
            {
                "name": "Adjusted Descriptive Title",
                "colors": ["#hex1", "#hex2", ...],
                "type": "linear" | "radial" | "conic",
                "angle": number (only for linear, 0-360)
            }
            \`\`\`
            
            Requirements:
            1. Adjust existing colors rather than generating completely new ones, unless the user explicitly asks for new colors.
            2. Focus on subtle refinements like exposure, contrast, warmth, and tone adjustments.
            3. Your reasoning must come BEFORE the JSON block and should describe the adjustments made.
        `;
    } else {
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

        // Basic validation of the parsed object
        if (!parsed.colors || !Array.isArray(parsed.colors)) {
            throw new Error("AI generated an invalid gradient (missing colors)");
        }

        return {
            ...parsed,
            reasoning: reasoning || undefined,
        };
    } catch (error: any) {
        console.error("Gemini AI Error Detailed:", error);
        throw new Error(error.message || "Failed to generate gradient with AI");
    }
};

