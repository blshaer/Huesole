import mongoose, { Document, Schema } from "mongoose";

export interface IHomeGradient extends Document {
    name: string;
    colors: string[];
    type: "linear" | "radial" | "conic";
    angle?: number;
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
    type: {
        type: String,
        enum: ["linear", "radial", "conic"],
        default: "linear",
    },
    angle: {
        type: Number,
        default: 90,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IHomeGradient>("HomeGradient", HomeGradientSchema);
