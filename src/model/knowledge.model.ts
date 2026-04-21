import mongoose, { model, Schema } from "mongoose";

interface IKnowledgeChunk {
    ownerId: string;
    text: string;
    embedding: number[];
    metadata?: {
        source?: string;
        page?: number;
        [key: string]: any;
    };
}

const knowledgeChunkSchema = new Schema<IKnowledgeChunk>(
    {
        ownerId: { type: String, required: true, index: true },
        text: { type: String, required: true },
        embedding: { type: [Number], required: true },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

const KnowledgeChunk = mongoose.models.KnowledgeChunk || model("KnowledgeChunk", knowledgeChunkSchema);
export default KnowledgeChunk;
