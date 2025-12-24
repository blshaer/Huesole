"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
const logFile = path_1.default.resolve(__dirname, "test-log.txt");
const log = (msg) => {
    console.log(msg);
    fs_1.default.appendFileSync(logFile, msg + "\n");
};
async function checkModel(apiVersion, modelName) {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${key}`;
    log(`Testing ${apiVersion} - ${modelName}...`);
    try {
        const response = await axios_1.default.post(url, {
            contents: [{ parts: [{ text: "hi" }] }]
        });
        log(`  SUCCESS: Status ${response.status}`);
        return true;
    }
    catch (error) {
        if (error.response) {
            log(`  FAILED: Status ${error.response.status} - ${JSON.stringify(error.response.data.error?.message || error.response.data)}`);
        }
        else {
            log(`  FAILED: ${error.message}`);
        }
        return false;
    }
}
async function test() {
    if (fs_1.default.existsSync(logFile))
        fs_1.default.unlinkSync(logFile);
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
