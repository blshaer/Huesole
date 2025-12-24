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
exports.updateProfile = exports.toggleFavorite = exports.updatePassword = exports.getMe = exports.googleLogin = exports.resendVerification = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.register = void 0;
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Helper to generate token
const generateToken = (id, email) => {
    return jsonwebtoken_1.default.sign({ id, email }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "30d",
    });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = yield User_1.default.create({
            name,
            email,
            password,
        });
        // Generate verification token
        const verificationToken = user.getVerificationToken();
        yield user.save();
        const CLIENT_URL = process.env.CLIENT_URL;
        const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">GradlyAI</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email</h2>
                    <p>Hi ${name},</p>
                    <p>Welcome to GradlyAI! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${verifyLink}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">Verify Email Address</a>
                    </div>
                    <p style="font-size: 0.9em; color: #64748b;">If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="font-size: 0.8em; word-break: break-all; color: #6366f1;">${verifyLink}</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                    <p style="font-size: 0.8em; color: #94a3b8; margin-bottom: 0;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div style="text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.8em;">
                    &copy; ${new Date().getFullYear()} GradlyAI. All rights reserved.
                </div>
            </div>
        `;
        try {
            yield (0, sendEmail_1.default)({
                email: user.email,
                subject: "Verify Your Email - GradlyAI",
                message: emailHtml,
            });
            res.status(201).json({
                success: true,
                message: "User registered. Please check email for verification.",
            });
        }
        catch (error) {
            console.error(error);
            user.verificationToken = undefined;
            yield user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Check if password matches
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first" });
        }
        res.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
            },
            token: generateToken(user._id.toString(), user.email),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.login = login;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    try {
        const user = yield User_1.default.findOne({
            verificationToken: token,
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        yield user.save();
        const tokenGenerated = user.getSignedJwtToken();
        res.status(200).json({
            success: true,
            token: tokenGenerated,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
            },
            message: "Email Verified",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.verifyEmail = verifyEmail;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const resetToken = user.getResetPasswordToken();
        yield user.save();
        const CLIENT_URL = req.headers.origin;
        const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">GradlyAI</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #1e293b; margin-top: 0;">Reset Your Password</h2>
                    <p>Hi,</p>
                    <p>You requested a password reset for your GradlyAI account. Please click the button below to choose a new password:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">Reset Password</a>
                    </div>
                    <p style="font-size: 0.9em; color: #64748b;">This link will expire in 10 minutes. If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="font-size: 0.8em; word-break: break-all; color: #ef4444;">${resetUrl}</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                    <p style="font-size: 0.8em; color: #94a3b8; margin-bottom: 0;">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
                </div>
                <div style="text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.8em;">
                    &copy; ${new Date().getFullYear()} GradlyAI. All rights reserved.
                </div>
            </div>
        `;
        try {
            yield (0, sendEmail_1.default)({
                email: user.email,
                subject: "Password Reset Request - GradlyAI",
                message: emailHtml,
            });
            res.status(200).json({ success: true, data: "Email sent" });
        }
        catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            yield user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    try {
        const user = yield User_1.default.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        res.status(200).json({
            success: true,
            token: generateToken(user._id.toString(), user.email),
            message: "Password reset successful"
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.resetPassword = resetPassword;
const resendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        const verificationToken = user.getVerificationToken();
        yield user.save();
        const CLIENT_URL = process.env.CLIENT_URL;
        const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">GradlyAI</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email</h2>
                    <p>Hi ${user.name},</p>
                    <p>You requested a new verification link. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${verifyLink}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">Verify Email Address</a>
                    </div>
                    <p style="font-size: 0.9em; color: #64748b;">If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="font-size: 0.8em; word-break: break-all; color: #6366f1;">${verifyLink}</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                    <p style="font-size: 0.8em; color: #94a3b8; margin-bottom: 0;">If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div style="text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.8em;">
                    &copy; ${new Date().getFullYear()} GradlyAI. All rights reserved.
                </div>
            </div>
        `;
        try {
            yield (0, sendEmail_1.default)({
                email: user.email,
                subject: "Verify Your Email - GradlyAI",
                message: emailHtml,
            });
            res.status(200).json({ success: true, message: "Verification link sent to your email." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Email could not be sent" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.resendVerification = resendVerification;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: "Invalid token" });
        }
        const { sub, email, name, picture } = payload;
        if (!email) {
            return res.status(400).json({ message: "Email not found in token" });
        }
        let user = yield User_1.default.findOne({ googleId: sub });
        if (!user) {
            // Check if user exists with email but no googleId (setup via email/password previously)
            user = yield User_1.default.findOne({ email });
            if (user) {
                // Link google account
                user.googleId = sub;
                user.picture = picture || user.picture;
                if (!user.isVerified)
                    user.isVerified = true;
                yield user.save();
            }
            else {
                user = yield User_1.default.create({
                    googleId: sub,
                    name,
                    email,
                    picture,
                    isVerified: true,
                });
            }
        }
        const jwtToken = generateToken(user._id.toString(), user.email);
        res.status(200).json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
            },
            token: jwtToken,
        });
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Server error during authentication" });
    }
});
exports.googleLogin = googleLogin;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            picture: user.picture,
            favorites: user.favorites
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getMe = getMe;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPassword, newPassword } = req.body;
    try {
        // @ts-ignore
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if current password is correct
        const isMatch = yield user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }
        user.password = newPassword;
        yield user.save();
        res.status(200).json({ success: true, message: "Password updated" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.updatePassword = updatePassword;
const toggleFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { gradientName } = req.body;
    try {
        // @ts-ignore
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const index = user.favorites.indexOf(gradientName);
        if (index === -1) {
            user.favorites.push(gradientName);
        }
        else {
            user.favorites.splice(index, 1);
        }
        yield user.save();
        res.status(200).json({
            success: true,
            favorites: user.favorites,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.toggleFavorite = toggleFavorite;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name } = req.body;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (name)
            user.name = name;
        // Handle file upload
        if (req.file) {
            // Store the path relative to the server (e.g., /uploads/picture-123.jpg)
            user.picture = `/uploads/${req.file.filename}`;
        }
        yield user.save();
        res.status(200).json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
            },
            message: "Profile updated successfully",
        });
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateProfile = updateProfile;
