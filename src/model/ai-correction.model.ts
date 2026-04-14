import mongoose, { model, Schema, Document, Model } from "mongoose";

export interface IAICorrection extends Document {
    ownerId: string;
    contactNumber: string;
    originalQuestion: string;
    badReply: string;
    correctReply: string;
    createdAt: Date;
    updatedAt: Date;
}

const AICorrectionSchema = new Schema<IAICorrection>(
    {
        ownerId: { type: String, required: true, index: true },
        // which contact triggered this correction (for context)
        contactNumber: { type: String, required: true },
        // the customer question that was answered badly
        originalQuestion: { type: String, required: true },
        // what the AI said (wrong)
        badReply: { type: String, required: true },
        // what the owner says the correct answer should be
        correctReply: { type: String, required: true },
    },
    { timestamps: true }
);

// Auto-delete corrections after 6 months — keeps the learning fresh
AICorrectionSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 180 }
);

const AICorrection: Model<IAICorrection> =
    mongoose.models.AICorrection ||
    model<IAICorrection>("AICorrection", AICorrectionSchema);

export default AICorrection;
