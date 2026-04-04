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
import pageRoutes from "./routes/pageRoutes";

dotenv.config();

const app = express();

/**
 * Security: Allow Google Auth Popups to close correctly
 */
app.use((_req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use(
    cors({
        origin: [
            "https://lumegradients.free.nf",
            "https://lumegradients.onrender.com",
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
app.use("/api/pages", pageRoutes);

// Serve static files from the React app
const clientDistPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDistPath));

// Handle React routing, return all requests to React app
app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
});

const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("❌ Failed to connect to Database:", (error as Error).message);
        console.warn("⚠️  Server starting WITHOUT database connection. Many features will not work until fixed.");
    }

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();
