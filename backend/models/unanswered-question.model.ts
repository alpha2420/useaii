import mongoose, { model, Schema, Document, Model } from "mongoose";

export interface IUnansweredQuestion extends Document {
    ownerId: string;
    question: string;
    contactNumber?: string;      // Added to track who to reply to on WhatsApp
    source: "widget" | "whatsapp";
    status: "unanswered" | "answered";
    answer?: string;
    // Upgraded fields for smart learning
    frequency: number;           // How many users asked this (or similar) question
    category: string;            // Auto-classified intent: pricing, location, timing, etc.
    embedding: number[];         // Vector for similarity grouping
    similarGroup?: string;       // MD5-style group ID linking similar questions
    createdAt: Date;
    updatedAt: Date;
}

const unansweredQuestionSchema = new Schema<IUnansweredQuestion>({
    ownerId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    contactNumber: { type: String },
    source: { type: String, enum: ["widget", "whatsapp"], default: "widget" },
    status: { type: String, enum: ["unanswered", "answered"], default: "unanswered" },
    answer: { type: String },
    // Smart learning fields
    frequency: { type: Number, default: 1 },
    category: { type: String, default: "unknown" },
    embedding: { type: [Number], default: [] },
    similarGroup: { type: String, index: true },
}, { timestamps: true });

const UnansweredQuestion: Model<IUnansweredQuestion> =
    mongoose.models.UnansweredQuestion ||
    model<IUnansweredQuestion>("UnansweredQuestion", unansweredQuestionSchema);

export default UnansweredQuestion;

