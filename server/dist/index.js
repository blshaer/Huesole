"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// API routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/ai", aiRoutes_1.default);
// Root route
app.get("/", (_req, res) => {
    res.send("API is running...");
});
// Use dynamic port (Render assigns PORT automatically)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
