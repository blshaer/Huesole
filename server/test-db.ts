import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
    console.log("Attempting to connect to MongoDB...");
    console.log("URI:", process.env.MONGO_URI?.replace(/:([^@]+)@/, ":****@"));
    
    try {
        await mongoose.connect(process.env.MONGO_URI || "", {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ MongoDB Connected successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ MongoDB Connection failed!");
        console.error(error);
        process.exit(1);
    }
};

testConnection();
