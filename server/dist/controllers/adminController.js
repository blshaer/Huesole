"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomeGradient = exports.updateHomeGradient = exports.createHomeGradient = exports.deleteSupportMessage = exports.updateSupportStatus = exports.getSupportMessages = exports.banUser = exports.getUserMessages = exports.updateUserRole = exports.deleteUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const SupportMessage_1 = __importDefault(require("../models/SupportMessage"));
const HomeGradient_1 = __importDefault(require("../models/HomeGradient"));
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({}).sort({ createdAt: -1 }).lean();
        // Fetch message counts for all users in one go
        const emails = users.map(u => u.email);
        const messageCounts = await SupportMessage_1.default.aggregate([
            { $match: { email: { $in: emails } } },
            { $group: { _id: "$email", count: { $sum: 1 } } }
        ]);
        const messageCountMap = Object.fromEntries(messageCounts.map(m => [m._id, m.count]));
        const usersWithCounts = users.map(user => ({
            ...user,
            supportMessagesCount: messageCountMap[user.email] || 0
        }));
        res.status(200).json({ success: true, data: usersWithCounts });
    }
    catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getUsers = getUsers;
// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent deleting yourself
        // @ts-ignore
        if (user._id.toString() === req.user?.id) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: "User deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteUser = deleteUser;
// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = req.body.role;
        await user.save();
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateUserRole = updateUserRole;
// @desc    Get messages by user email
// @route   GET /api/admin/users/:email/messages
// @access  Private/Admin
const getUserMessages = async (req, res) => {
    try {
        const messages = await SupportMessage_1.default.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getUserMessages = getUserMessages;
// @desc    Ban or unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent banning yourself
        // @ts-ignore
        if (user._id.toString() === req.user?.id) {
            return res.status(400).json({ message: "You cannot ban yourself" });
        }
        user.isBanned = req.body.isBanned;
        user.banMessage = req.body.banMessage || "";
        await user.save();
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.banUser = banUser;
// @desc    Get all support messages
// @route   GET /api/admin/support
// @access  Private/Admin
const getSupportMessages = async (req, res) => {
    try {
        const messages = await SupportMessage_1.default.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getSupportMessages = getSupportMessages;
// @desc    Update support message status
// @route   PUT /api/admin/support/:id
// @access  Private/Admin
const updateSupportStatus = async (req, res) => {
    try {
        const message = await SupportMessage_1.default.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        message.status = req.body.status;
        await message.save();
        res.status(200).json({ success: true, data: message });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateSupportStatus = updateSupportStatus;
// @desc    Delete support message
// @route   DELETE /api/admin/support/:id
// @access  Private/Admin
const deleteSupportMessage = async (req, res) => {
    try {
        const message = await SupportMessage_1.default.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        await message.deleteOne();
        res.status(200).json({ success: true, message: "Message deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteSupportMessage = deleteSupportMessage;
// --- Home Gradient Admin Controllers ---
// @desc    Add new home gradient
// @route   POST /api/admin/home-gradients
// @access  Private/Admin
const createHomeGradient = async (req, res) => {
    try {
        const { name, colors, type, angle } = req.body;
        const gradient = await HomeGradient_1.default.create({ name, colors, type, angle });
        res.status(201).json({ success: true, data: gradient });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
exports.createHomeGradient = createHomeGradient;
// @desc    Update home gradient
// @route   PUT /api/admin/home-gradients/:id
// @access  Private/Admin
const updateHomeGradient = async (req, res) => {
    try {
        const gradient = await HomeGradient_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!gradient) {
            return res.status(404).json({ message: "Gradient not found" });
        }
        res.status(200).json({ success: true, data: gradient });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateHomeGradient = updateHomeGradient;
// @desc    Delete home gradient
// @route   DELETE /api/admin/home-gradients/:id
// @access  Private/Admin
const deleteHomeGradient = async (req, res) => {
    try {
        const gradient = await HomeGradient_1.default.findById(req.params.id);
        if (!gradient) {
            return res.status(404).json({ message: "Gradient not found" });
        }
        await gradient.deleteOne();
        res.status(200).json({ success: true, message: "Gradient deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteHomeGradient = deleteHomeGradient;
