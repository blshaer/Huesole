"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const supportRoutes_1 = __importDefault(require("./routes/supportRoutes"));
const homeGradientRoutes_1 = __importDefault(require("./routes/homeGradientRoutes"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
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
}));
app.use(express_1.default.json());
// static uploads
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// API routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/support", supportRoutes_1.default);
app.use("/api/home-gradients", homeGradientRoutes_1.default);
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
// Handle React routing, return all requests to React app
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../client/dist", "index.html"));
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
