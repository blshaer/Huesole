import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
