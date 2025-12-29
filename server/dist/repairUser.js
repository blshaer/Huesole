"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const repairUser = async () => {
    try {
        await (0, db_1.default)();
        const email = "blshaer@outlook.com";
        let user = await User_1.default.findOne({ email });
        if (!user) {
            console.log("User not found, nothing to repair.");
        }
        else {
            console.log("Repairing user: " + email);
            user.role = "admin";
            user.isVerified = true;
            user.password = "082132096Baraa*"; // This will be hashed correctly by our fixed pre-save hook
            await user.save();
            console.log("User repaired successfully.");
        }
        process.exit();
    }
    catch (error) {
        console.error("Repair error:", error);
        process.exit(1);
    }
};
repairUser();
