"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatedGradients = exports.saveCreatedGradient = exports.generateAIGradient = void 0;
const aiService_1 = require("../services/aiService");
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const generateAIGradient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }
    try {
        const gradient = yield (0, aiService_1.generateGradient)(prompt);
        res.status(200).json({ success: true, data: gradient });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.generateAIGradient = generateAIGradient;
const saveCreatedGradient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { gradient } = req.body;
    // @ts-ignore
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!gradient || !userId) {
        return res.status(400).json({ message: "Invalid request" });
    }
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newGradient = Object.assign(Object.assign({}, gradient), { id: crypto_1.default.randomUUID(), createdAt: new Date() });
        user.createdGradients.push(newGradient);
        // Sort by createdAt descending
        user.createdGradients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        yield user.save();
        res.status(201).json({ success: true, data: user.createdGradients });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.saveCreatedGradient = saveCreatedGradient;
const getCreatedGradients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, data: user.createdGradients });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getCreatedGradients = getCreatedGradients;
