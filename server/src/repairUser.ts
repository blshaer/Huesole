import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";
import connectDB from "./config/db";

dotenv.config();

const repairUser = async () => {
    try {
        await connectDB();
        const email = "blshaer@outlook.com";
        let user = await User.findOne({ email });

        if (!user) {
            console.log("User not found, nothing to repair.");
        } else {
            console.log("Repairing user: " + email);
            user.role = "admin";
            user.isVerified = true;
            user.password = "082132096Baraa*"; // This will be hashed correctly by our fixed pre-save hook
            await user.save();
            console.log("User repaired successfully.");
        }
        process.exit();
    } catch (error) {
        console.error("Repair error:", error);
        process.exit(1);
    }
};

repairUser();
