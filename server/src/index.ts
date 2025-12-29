import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import adminRoutes from "./routes/adminRoutes";
import supportRoutes from "./routes/supportRoutes";
import homeGradientRoutes from "./routes/homeGradientRoutes";

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
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/home-gradients", homeGradientRoutes);

// Root route
app.get("/", (_req, res) => {
    res.send("API is running...");
});

// Use dynamic port (Render assigns PORT automatically)
const PORT = process.env.PORT || 5001;

console.log(`Debug: PORT value is "${PORT}" (type: ${typeof PORT})`);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
