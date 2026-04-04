import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User";

// Load env vars from the server root
dotenv.config({ path: path.join(__dirname, "../../.env") });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/gradlyai");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const makeAdmin = async () => {
    await connectDB();

    const email = "blshaer@outlook.com";

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            console.log(`User with email ${email} not found.`);
        } else {
            console.log(`User ${user.name} (username: ${user.username}) is now an ADMIN.`);
        }
    } catch (error: any) {
        console.error(`Error updating user: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

makeAdmin();
