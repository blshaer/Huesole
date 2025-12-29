import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";
import connectDB from "./config/db";

dotenv.config();

const checkUser = async () => {
    try {
        await connectDB();
        const user = await User.findOne({ email: "blshaer@outlook.com" }).select("+password");

        if (!user) {
            console.log("DIAGNOSTIC: User not found: blshaer@outlook.com");
        } else {
            const data = {
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                hasPassword: !!user.password,
                googleId: user.googleId,
                id: (user._id as any).toString()
            };
            console.log("DIAGNOSTIC_DATA:" + JSON.stringify(data));
        }
        process.exit();
    } catch (error) {
        console.error("Check error:", error);
        process.exit(1);
    }
};

checkUser();
