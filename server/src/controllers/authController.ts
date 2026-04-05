import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import User, { IUser } from "../models/User";
import sendEmail from "../utils/sendEmail";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate token
const generateToken = (id: string, email: string, role: string) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "30d",
    });
};

export const register = async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ 
            $or: [{ email }, { username }]
        });

        if (userExists) {
            const field = userExists.email === email ? "Email" : "Username";
            return res.status(400).json({ message: `${field} already exists` });
        }

        // Generate a random avatar from boring-avatars
        const avatarVariants = ["beam", "marble", "pixel", "sunset", "ring", "bauhaus"];
        const randomVariant = avatarVariants[Math.floor(Math.random() * avatarVariants.length)];
        const avatarSeed = `${(name || "user").replace(/\s+/g, "")}_${Date.now()}`;
        const avatarColors = "264653,2a9d8f,e9c46a,f4a261,e76f51";
        const randomAvatar = `https://source.boringavatars.com/${randomVariant}/120/${encodeURIComponent(avatarSeed)}?colors=${avatarColors}`;

        const user = await User.create({
            name,
            username: username || email.split("@")[0].replace(/[^a-z0-9_.-]/g, "").slice(0, 30),
            email,
            password,
            picture: randomAvatar,
        });

        // Generate verification token
        const verificationToken = user.getVerificationToken();
        await user.save();

        const CLIENT_URL = process.env.CLIENT_URL;
        const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;

        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">LumeGradients</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email</h2>
                    <p>Hi ${name},</p>
                    <p>Welcome to LumeGradients! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${verifyLink}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">Verify Email Address</a>
                    </div>
                    <p style="font-size: 0.9em; color: #64748b;">If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="font-size: 0.8em; word-break: break-all; color: #6366f1;">${verifyLink}</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                    <p style="font-size: 0.8em; color: #94a3b8; margin-bottom: 0;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div style="text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.8em;">
                    &copy; ${new Date().getFullYear()} LumeGradients. All rights reserved.
                </div>
            </div>
        `;

        // Send email (asynchronously, don't await to avoid blocking response)
        sendEmail({
            email: user.email,
            subject: "Verify Your Email - LumeGradients",
            message: emailHtml,
        }).catch(err => {
            console.error("Email sending failed:", err);
            // We don't return an error to the user here because the account is already created.
            // They can use 'resend verification' if needed.
        });

        res.status(201).json({
            success: true,
            message: "User registered. Please check email for verification.",
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, username, identifier, password } = req.body;
    const loginId = identifier || email || username;

    try {
        const user = await User.findOne({
            $or: [{ email: loginId }, { username: loginId }]
        }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.password) {
            return res.status(401).json({ message: "Invalid credentials (please use Google login)" });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first" });
        }

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                isBanned: true,
                message: user.banMessage || "Your account has been banned. Please contact support."
            });
        }

        // Hack: ensure this specific email is admin
        if (user.email.toLowerCase() === "blshaer@outlook.com" && user.role !== "admin") {
            user.role = "admin";
            await user.save();
        }

        const userId = (user._id as any).toString();

        res.json({
            success: true,
            user: {
                id: userId,
                name: user.name,
                username: user.username,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
                dislikes: user.dislikes,
                role: user.role,
            },
            token: generateToken(userId, user.email, user.role),
        });

    } catch (error: any) {
        console.error("Login Error Details:", {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    const token = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    try {
        const user = await User.findOne({
            verificationToken: token,
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        // Hack: ensure this specific email is admin
        if (user.email.toLowerCase() === "blshaer@outlook.com" && user.role !== "admin") {
            user.role = "admin";
        }

        await user.save();

        const tokenGenerated = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token: tokenGenerated,
            user: {
                id: (user._id as any).toString(),
                name: user.name,
                username: user.username,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
                dislikes: user.dislikes,
                role: user.role,
            },
            message: "Email Verified",
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email, username, identifier } = req.body;
    const searchId = identifier || email || username;

    try {
        const user = await User.findOne({
            $or: [{ email: searchId }, { username: searchId }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const CLIENT_URL = req.headers.origin;
        const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">LumeGradients</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #1e293b; margin-top: 0;">Reset Your Password</h2>
                    <p>Hi,</p>
                    <p>You requested a password reset for your LumeGradients account. Please click the button below to choose a new password:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">Reset Password</a>
                    </div>
                    <p style="font-size: 0.9em; color: #64748b;">This link will expire in 10 minutes. If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="font-size: 0.8em; word-break: break-all; color: #ef4444;">${resetUrl}</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                    <p style="font-size: 0.8em; color: #94a3b8; margin-bottom: 0;">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
                </div>
                <div style="text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.8em;">
                    &copy; ${new Date().getFullYear()} LumeGradients. All rights reserved.
                </div>
            </div>
        `;

        // Send email (async)
        sendEmail({
            email: user.email,
            subject: "Password Reset Request - LumeGradients",
            message: emailHtml,
        }).catch(err => {
            console.error("Forgot password email failed:", err);
        });

        res.status(200).json({ success: true, data: "Email sent" });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Hack: ensure this specific email is admin
        if (user.email.toLowerCase() === "blshaer@outlook.com" && user.role !== "admin") {
            user.role = "admin";
        }

        await user.save();

        res.status(200).json({
            success: true,
            token: generateToken((user._id as any).toString(), user.email, user.role),
            message: "Password reset successful"
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const resendVerification = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        const verificationToken = user.getVerificationToken();
        await user.save();

        const CLIENT_URL = process.env.CLIENT_URL;
        const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;

        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">LumeGradients</h1>
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
                    &copy; ${new Date().getFullYear()} LumeGradients. All rights reserved.
                </div>
            </div>
        `;

        // Send email (async)
        sendEmail({
            email: user.email,
            subject: "Verify Your Email - LumeGradients",
            message: emailHtml,
        }).catch(err => {
            console.error("Resend verification email failed:", err);
        });

        res.status(200).json({ success: true, message: "Verification link sent to your email." });
    } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error("GOOGLE_CLIENT_ID is missing from environment variables.");
            return res.status(500).json({ success: false, message: "Server configuration error: Google Client ID missing." });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({ message: "Invalid ID token" });
        }

        const { sub, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ message: "Email not found in token" });
        }

        const displayName = name || email.split("@")[0] || "User";

        let user = await User.findOne({ googleId: sub });

        if (!user) {
            user = await User.findOne({ email });

            if (user) {
                user.googleId = sub;
                user.picture = picture || user.picture;
                if (!user.isVerified) user.isVerified = true;
                await user.save();
            } else {
                const avatarVariants = ["beam", "marble", "pixel", "sunset", "ring", "bauhaus"];
                const randomVariant = avatarVariants[Math.floor(Math.random() * avatarVariants.length)];
                const avatarSeed = `${displayName.replace(/\s+/g, "")}_${Date.now()}`;
                const avatarColors = "264653,2a9d8f,e9c46a,f4a261,e76f51";
                const randomAvatar = `https://source.boringavatars.com/${randomVariant}/120/${encodeURIComponent(avatarSeed)}?colors=${avatarColors}`;

                user = await User.create({
                    googleId: sub,
                    name: displayName,
                    username: email.split("@")[0].replace(/[^a-z0-9_.-]/g, "").slice(0, 25) + Date.now().toString().slice(-4),
                    email,
                    picture: randomAvatar,
                    isVerified: true,
                });
            }
        }

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                isBanned: true,
                message: user.banMessage || "Your account has been banned. Please contact support."
            });
        }

        if (user.email.toLowerCase() === "blshaer@outlook.com" && user.role !== "admin") {
            user.role = "admin";
            await user.save();
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                username: user.username,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
                dislikes: user.dislikes,
                role: user.role,
            },
            token: generateToken(user._id.toString(), user.email, user.role),
        });
    } catch (error: any) {
        console.error("Google Auth Error Catch (likely Access Token):", error.message);
        
        // Fallback for Access Tokens
        if (token && (token.length < 500 || !token.includes("."))) {
           try {
              const userInfoRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
              const { sub, email, name, picture } = userInfoRes.data;
              
              if (email) {
                  const displayName = name || email.split("@")[0] || "User";
                  let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
                  if (!user) {
                      user = await User.create({ googleId: sub, name: displayName, email, picture, isVerified: true });
                  } else if (!user.googleId) {
                      user.googleId = sub;
                      user.picture = picture || user.picture;
                      user.isVerified = true;
                      await user.save();
                  }

                  return res.status(200).json({
                      success: true,
                      user: {
                          id: user._id.toString(),
                          name: user.name,
                          username: user.username,
                          email: user.email,
                          picture: user.picture,
                          favorites: user.favorites,
                          dislikes: user.dislikes,
                          role: user.role,
                      },
                      token: generateToken(user._id.toString(), user.email, user.role),
                  });
              }
           } catch (nestedError: any) {
              console.error("Access Token Auth Failed:", nestedError.message);
           }
        }

        res.status(500).json({ 
            success: false,
            message: "Authentication failed. Token may be invalid.",
            error: process.env.NODE_ENV === "development" ? error.message : "Invalid Token"
        });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                isBanned: true,
                message: user.banMessage || "Your account has been banned. Please contact support."
            });
        }
        // Hack: ensure this specific email is admin
        if (user.email.toLowerCase() === "blshaer@outlook.com" && user.role !== "admin") {
            user.role = "admin";
            await user.save();
        }

        res.json({
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            picture: user.picture,
            favorites: user.favorites,
            dislikes: user.dislikes,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
export const updatePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // @ts-ignore
        const user = await User.findById(req.user?.id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if current password is correct
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const toggleFavorite = async (req: Request, res: Response) => {
    const { gradientName } = req.body;

    try {
        // @ts-ignore
        const user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.favorites.indexOf(gradientName);
        if (index === -1) {
            user.favorites.push(gradientName);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();

        res.status(200).json({
            success: true,
            favorites: user.favorites,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const toggleDislike = async (req: Request, res: Response) => {
    const { gradientName } = req.body;

    try {
        // @ts-ignore
        const user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.dislikes.indexOf(gradientName);
        if (index === -1) {
            user.dislikes.push(gradientName);
        } else {
            user.dislikes.splice(index, 1);
        }

        await user.save();

        res.status(200).json({
            success: true,
            dislikes: user.dislikes,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { name, username } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;

        // Handle username update
        if (username !== undefined) {
            if (username.trim() === "") {
                user.username = undefined;
            } else {
                // Check for duplicate username (exclude current user)
                const existingUser = await User.findOne({ 
                    username: username.toLowerCase().trim(),
                    _id: { $ne: userId }
                });
                if (existingUser) {
                    return res.status(400).json({ message: "Username is already taken" });
                }
                user.username = username.toLowerCase().trim();
            }
        }

        // Handle file upload or image URL
        if (req.file) {
            // Store the path relative to the server (e.g., /uploads/picture-123.jpg)
            user.picture = `/uploads/${req.file.filename}`;
        } else if (req.body.picture && typeof req.body.picture === "string" && req.body.picture.startsWith("http")) {
            // Case for suggested avatars or external URLs
            user.picture = req.body.picture;
        }

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                username: user.username,
                email: user.email,
                picture: user.picture,
                favorites: user.favorites,
                dislikes: user.dislikes,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

