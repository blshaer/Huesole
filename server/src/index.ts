import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Root route
app.get("/", (_req, res) => {
    res.send("API is running...");
});

// Use dynamic port (Render assigns PORT automatically)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
