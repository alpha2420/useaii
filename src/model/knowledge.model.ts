import mongoose, { model, Schema, Document, Model } from "mongoose";

export interface IKnowledgeChunk extends Document {
    ownerId: string;
    chunkText: string;
    embedding: number[];
    category?: string;
    aliases?: string[];
    intent?: string;
    priority?: "high" | "medium" | "low";
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const KnowledgeChunkSchema = new Schema<IKnowledgeChunk>(
    {
        ownerId: { type: String, required: true, index: true },
        chunkText: { type: String, required: true },
        embedding: { type: [Number], required: true },
        category: { type: String, index: true },
        aliases: { type: [String] },
        intent: { type: String, index: true },
        priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
        tags: { type: [String] },
    },
    { timestamps: true }
);

// Index for fast lookup by owner
KnowledgeChunkSchema.index({ ownerId: 1 });

const KnowledgeChunk: Model<IKnowledgeChunk> =
    mongoose.models.KnowledgeChunk ||
    model<IKnowledgeChunk>("KnowledgeChunk", KnowledgeChunkSchema);

export default KnowledgeChunk;
