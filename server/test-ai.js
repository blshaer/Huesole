import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const logFile = path.resolve(__dirname, "test-log.txt");
if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
};

async function test() {
    log("Testing gemini-flash-latest with the SDK...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        log("  SUCCESS! SDK Response: " + response.text().substring(0, 50));
    } catch (e) {
        log("  FAILED! SDK Error: " + e.message);
    }
}

test().then(() => {
    log("Check finished.");
    process.exit(0);
});
