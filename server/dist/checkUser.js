"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const checkUser = async () => {
    try {
        await (0, db_1.default)();
        const user = await User_1.default.findOne({ email: "blshaer@outlook.com" }).select("+password");
        if (!user) {
            console.log("DIAGNOSTIC: User not found: blshaer@outlook.com");
        }
        else {
            const data = {
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                hasPassword: !!user.password,
                googleId: user.googleId,
                id: user._id.toString()
            };
            console.log("DIAGNOSTIC_DATA:" + JSON.stringify(data));
        }
        process.exit();
    }
    catch (error) {
        console.error("Check error:", error);
        process.exit(1);
    }
};
checkUser();
