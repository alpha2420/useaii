import mongoose, { model, Schema, Document, Model } from "mongoose";

export interface IPendingMessage extends Document {
    ownerId: string;
    to: string;        // contactNumber e.g. "919876543210@c.us"
    text: string;
    status: "pending" | "sent" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

const PendingMessageSchema = new Schema<IPendingMessage>(
    {
        ownerId: { type: String, required: true, index: true },
        to: { type: String, required: true },
        text: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "sent", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Auto-delete sent/failed messages after 7 days
PendingMessageSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 604800 });

const PendingMessage: Model<IPendingMessage> =
    mongoose.models.PendingMessage ||
    model<IPendingMessage>("PendingMessage", PendingMessageSchema);

export default PendingMessage;
