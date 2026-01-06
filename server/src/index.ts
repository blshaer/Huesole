import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import adminRoutes from "./routes/adminRoutes";
import supportRoutes from "./routes/supportRoutes";
import homeGradientRoutes from "./routes/homeGradientRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(
    cors({
        origin: [
            "https://gradlyai.free.nf",
            "https://gradlyai.onrender.com",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
        ],
        credentials: true,
    }),
);

app.use(express.json());

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/home-gradients", homeGradientRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Handle React routing, return all requests to React app
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
