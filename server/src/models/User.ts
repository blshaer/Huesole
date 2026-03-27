import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
    googleId?: string;
    name: string;
    username?: string;
    email: string;
    password?: string;
    picture?: string;
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    isBanned: boolean;
    banMessage?: string;
    createdAt: Date;
    role: "user" | "admin";
    favorites: string[];
    createdGradients: {
        id: string;
        name: string;
        colors: string[];
        type: "linear" | "radial" | "conic";
        angle?: number;
        createdAt: Date;
    }[];
    matchPassword(enteredPassword: string): Promise<boolean>;
    getResetPasswordToken(): string;
    getVerificationToken(): string;
    getSignedJwtToken(): string;
}

const UserSchema: Schema = new Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9_.-]+$/, "Username can only contain lowercase letters, numbers, dots, hyphens, and underscores"],
        maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    password: {
        type: String,
        select: false, // Don't return password by default
    },
    picture: {
        type: String,
        default: "no-photo.jpg",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isBanned: {
        type: Boolean,
        default: false,
    },
    banMessage: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    favorites: [
        {
            type: String,
        },
    ],
    createdGradients: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            colors: [{ type: String, required: true }],
            type: { type: String, enum: ["linear", "radial", "conic"], required: true },
            angle: { type: Number },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (this: any) {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set expire
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

    return resetToken;
};

// Generate and hash verification token
UserSchema.methods.getVerificationToken = function () {
    const verificationToken = crypto.randomBytes(20).toString("hex");

    this.verificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    return verificationToken;
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    const jwt = require("jsonwebtoken");
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET || "fallback_secret",
        {
            expiresIn: "30d",
        }
    );
};

export default mongoose.model<IUser>("User", UserSchema);
