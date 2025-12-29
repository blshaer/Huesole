import mongoose, { Document, Schema } from "mongoose";

export interface ISupportMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "new" | "read" | "replied";
    createdAt: Date;
}

const SupportMessageSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    subject: {
        type: String,
        required: [true, "Please add a subject"],
    },
    message: {
        type: String,
        required: [true, "Please add a message"],
    },
    status: {
        type: String,
        enum: ["new", "read", "replied"],
        default: "new",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ISupportMessage>("SupportMessage", SupportMessageSchema);
