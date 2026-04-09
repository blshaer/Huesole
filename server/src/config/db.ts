import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const uri = (process.env.MONGO_URI || "").trim().replace(/^["']|["']$/g, "");
        if (!uri) {
           throw new Error("MONGO_URI is missing or empty");
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        throw error;
    }
};

export default connectDB;
