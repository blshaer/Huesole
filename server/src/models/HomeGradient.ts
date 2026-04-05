import mongoose, { Document, Schema } from "mongoose";

export interface IHomeGradient extends Document {
    name: string;
    colors: string[];
    type: "linear" | "radial" | "conic";
    angle?: number;
    rawCss?: string;
    colorsname?: string[];
    keywords?: string[][];
    createdAt: Date;
}

const HomeGradientSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
    },
    colors: {
        type: [String],
        required: [true, "Please add colors"],
    },
    colorsname: {
        type: [String],
        default: [],
    },
    keywords: {
        type: [[String]],
        default: [],
    },
    type: {
        type: String,
        enum: ["linear", "radial", "conic"],
        default: "linear",
    },
    angle: {
        type: Number,
        default: 90,
    },
    rawCss: {
        type: String,
        default: null,
    },
    order: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IHomeGradient>("HomeGradient", HomeGradientSchema);
