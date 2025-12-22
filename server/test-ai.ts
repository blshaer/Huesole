import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import axios from "axios";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const logFile = path.resolve(__dirname, "test-log.txt");
const log = (msg: string) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
};

async function checkModel(apiVersion: string, modelName: string) {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${key}`;
    log(`Testing ${apiVersion} - ${modelName}...`);
    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "hi" }] }]
        });
        log(`  SUCCESS: Status ${response.status}`);
        return true;
    } catch (error: any) {
        if (error.response) {
            log(`  FAILED: Status ${error.response.status} - ${JSON.stringify(error.response.data.error?.message || error.response.data)}`);
        } else {
            log(`  FAILED: ${error.message}`);
        }
        return false;
    }
}

async function test() {
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
    log("Detailed Model/API Version Check...");

    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];
    const versions = ["v1", "v1beta"];

    for (const v of versions) {
        for (const m of models) {
            await checkModel(v, m);
        }
    }
}

test().then(() => {
    log("Check finished.");
    process.exit(0);
});
