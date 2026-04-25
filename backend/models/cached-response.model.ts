import mongoose, { model, Schema, Document, Model } from "mongoose";

export interface ICachedResponse extends Document {
    ownerId: string;
    normalizedQuestion: string; // lowercased, stripped question used as cache key
    questionEmbedding: number[]; // the vector representation
    reply: string;              // the saved AI answer
    intent?: string;            // the classified bucket (e.g. pricing, location)
    hitCount: number;           // how many times this cache entry was reused
    expiresAt: Date;            // auto-delete after 7 days
    createdAt: Date;
    updatedAt: Date;
}

const CachedResponseSchema = new Schema<ICachedResponse>(
    {
        ownerId: { type: String, required: true, index: true },
        normalizedQuestion: { type: String, required: true },
        intent: { type: String, index: true }, // Optional bucket key
        questionEmbedding: { type: [Number], required: true }, // Store the OpenAI vector
        reply: { type: String, required: true },
        hitCount: { type: Number, default: 0 },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days TTL
            index: { expires: 0 }, // MongoDB TTL index — auto-deletes expired docs
        },
    },
    { timestamps: true }
);

// Compound index: fast lookup by owner + question
CachedResponseSchema.index({ ownerId: 1, normalizedQuestion: 1 }, { unique: true });

const CachedResponse: Model<ICachedResponse> =
    mongoose.models.CachedResponse ||
    model<ICachedResponse>("CachedResponse", CachedResponseSchema);

export default CachedResponse;
