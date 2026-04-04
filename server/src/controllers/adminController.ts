import { Request, Response } from "express";
import HomeGradient from "../models/HomeGradient";
import SupportMessage from "../models/SupportMessage";
import User from "../models/User";
import PageContent from "../models/PageContent";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).lean();

        // Fetch message counts for all users in one go
        const emails = users.map(u => u.email);
        const messageCounts = await SupportMessage.aggregate([
            { $match: { email: { $in: emails } } },
            { $group: { _id: "$email", count: { $sum: 1 } } }
        ]);

        const messageCountMap = Object.fromEntries(messageCounts.map(m => [m._id, m.count]));

        const usersWithCounts = users.map(user => ({
            ...user,
            supportMessagesCount: messageCountMap[user.email] || 0
        }));

        res.status(200).json({ success: true, data: usersWithCounts });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

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
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = req.body.role;
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get messages by user email
// @route   GET /api/admin/users/:email/messages
// @access  Private/Admin
export const getUserMessages = async (req: Request, res: Response) => {
    try {
        const messages = await SupportMessage.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Ban or unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const banUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

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
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all support messages
// @route   GET /api/admin/support
// @access  Private/Admin
export const getSupportMessages = async (req: Request, res: Response) => {
    try {
        const messages = await SupportMessage.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update support message status
// @route   PUT /api/admin/support/:id
// @access  Private/Admin
export const updateSupportStatus = async (req: Request, res: Response) => {
    try {
        const message = await SupportMessage.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        message.status = req.body.status;
        await message.save();

        res.status(200).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete support message
// @route   DELETE /api/admin/support/:id
// @access  Private/Admin
export const deleteSupportMessage = async (req: Request, res: Response) => {
    try {
        const message = await SupportMessage.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        await message.deleteOne();
        res.status(200).json({ success: true, message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// --- Home Gradient Admin Controllers ---

// @desc    Add new home gradient
// @route   POST /api/admin/home-gradients
// @access  Private/Admin
export const createHomeGradient = async (req: Request, res: Response) => {
    try {
        const { name, colors, type, angle } = req.body;
        const gradient = await HomeGradient.create({ name, colors, type, angle });
        res.status(201).json({ success: true, data: gradient });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update home gradient
// @route   PUT /api/admin/home-gradients/:id
// @access  Private/Admin
export const updateHomeGradient = async (req: Request, res: Response) => {
    try {
        const gradient = await HomeGradient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!gradient) {
            return res.status(404).json({ message: "Gradient not found" });
        }

        res.status(200).json({ success: true, data: gradient });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete home gradient
// @route   DELETE /api/admin/home-gradients/:id
// @access  Private/Admin
export const deleteHomeGradient = async (req: Request, res: Response) => {
    try {
        const gradient = await HomeGradient.findById(req.params.id);

        if (!gradient) {
            return res.status(404).json({ message: "Gradient not found" });
        }

        await gradient.deleteOne();
        res.status(200).json({ success: true, message: "Gradient deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// --- Page Content Admin Controllers ---

// @desc    Get or create page content
// @route   GET /api/admin/page-content/:pageName
// @access  Private/Admin
export const getPageContentAdmin = async (req: Request, res: Response) => {
    try {
        const { pageName } = req.params;
        let content = await PageContent.findOne({ pageName: pageName.toLowerCase() });

        if (!content) {
            // Create default template if it doesn't exist
            content = await PageContent.create({
                pageName: pageName.toLowerCase(),
                title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
                description: `Default description for ${pageName}`,
                content: `<h1>${pageName}</h1><p>Edit this content in the admin dashboard.</p>`
            });
        }

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update page content
// @route   PUT /api/admin/page-content/:pageName
// @access  Private/Admin
export const updatePageContent = async (req: Request, res: Response) => {
    try {
        const { pageName } = req.params;
        const { title, description, content } = req.body;

        const updatedContent = await PageContent.findOneAndUpdate(
            { pageName: pageName.toLowerCase() },
            { title, description, content },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedContent });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
