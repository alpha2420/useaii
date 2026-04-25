import mongoose, { Schema, model } from "mongoose";

export interface IUsageLog {
    userId: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    type: "chat" | "refine" | "classify";
    cost?: number; // estimated cost in USD or local currency
    timestamp: Date;
}

const usageLogSchema = new Schema<IUsageLog>(
    {
        userId: { type: String, required: true, index: true },
        model: { type: String, required: true },
        promptTokens: { type: Number, default: 0 },
        completionTokens: { type: Number, default: 0 },
        totalTokens: { type: Number, default: 0 },
        type: { type: String, enum: ["chat", "refine", "classify"], default: "chat" },
        cost: { type: Number, default: 0 },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const UsageLog = mongoose.models.UsageLog || model("UsageLog", usageLogSchema);
export default UsageLog;
