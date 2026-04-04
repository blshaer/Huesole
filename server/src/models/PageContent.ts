import mongoose from "mongoose";

interface IPageContent extends mongoose.Document {
  pageName: string; // "privacy", "terms", etc.
  title: string;
  description: string;
  content: string; // Markdown or HTML
  updatedAt: Date;
}

const pageContentSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPageContent>("PageContent", pageContentSchema);
