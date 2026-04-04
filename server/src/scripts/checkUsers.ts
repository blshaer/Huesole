import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI || "");
    const users = await User.find({});
    console.log(JSON.stringify(users.map(u => ({
        name: u.name,
        username: (u as any).username,
        email: u.email
    })), null, 2));
    await mongoose.disconnect();
}
check();
