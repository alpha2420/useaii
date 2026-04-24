import mongoose, { model, Schema, Document, Model } from "mongoose";

export interface IMessage {
    role: "customer" | "bot" | "owner";
    text: string;
    timestamp: Date;
}

export type CRMStage = "new" | "contacted" | "interested" | "negotiating" | "won" | "lost";

export interface IEnriched {
    company: string | null;
    location: string | null;
    email: string | null;
    language: string | null;
}

export interface IConversation extends Document {
    ownerId: string;
    contactNumber: string;
    contactName: string;
    messages: IMessage[];
    // AI Analysis
    intent: "buying" | "inquiry" | "complaint" | "spam" | "unknown";
    urgency: "high" | "medium" | "low";
    leadScore: "hot" | "warm" | "cold";
    extractedName: string | null;
    extractedBudget: string | null;
    summary: string | null;
    lastAnalyzedAt: Date | null;
    sentiment: "positive" | "neutral" | "negative" | "unknown";
    source: "whatsapp" | "widget" | "email" | "unknown";
    firstReplyTime: number | null; // in seconds
    // Next Best Action
    nextBestAction: string | null;
    nextBestActionType: "follow_up" | "send_pricing" | "close" | "nurture" | "escalate" | "none" | null;
    // Enriched Records
    enriched: IEnriched;
    // CRM Fields
    stage: CRMStage;
    notes: string;
    tags: string[];
    isAiPaused: boolean;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        role: { type: String, enum: ["customer", "bot", "owner"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const EnrichedSchema = new Schema<IEnriched>(
    {
        company: { type: String, default: null },
        location: { type: String, default: null },
        email: { type: String, default: null },
        language: { type: String, default: null },
    },
    { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
    {
        ownerId: { type: String, required: true, index: true },
        contactNumber: { type: String, required: true },
        contactName: { type: String, default: "" },
        messages: { type: [MessageSchema], default: [] },
        // AI Analysis
        intent: {
            type: String,
            enum: ["buying", "inquiry", "complaint", "spam", "unknown"],
            default: "unknown",
        },
        urgency: { type: String, enum: ["high", "medium", "low"], default: "low" },
        leadScore: { type: String, enum: ["hot", "warm", "cold"], default: "cold" },
        extractedName: { type: String, default: null },
        extractedBudget: { type: String, default: null },
        summary: { type: String, default: null },
        lastAnalyzedAt: { type: Date, default: null },
        sentiment: { 
            type: String, 
            enum: ["positive", "neutral", "negative", "unknown"], 
            default: "unknown" 
        },
        source: { 
            type: String, 
            enum: ["whatsapp", "widget", "email", "unknown"], 
            default: "whatsapp" // Defaulting to WhatsApp since that's the main channel
        },
        firstReplyTime: { type: Number, default: null },
        // Next Best Action
        nextBestAction: { type: String, default: null },
        nextBestActionType: {
            type: String,
            enum: ["follow_up", "send_pricing", "close", "nurture", "escalate", "none", null],
            default: null,
        },
        // Enriched Records
        enriched: { type: EnrichedSchema, default: () => ({}) },
        // CRM
        stage: {
            type: String,
            enum: ["new", "contacted", "interested", "negotiating", "won", "lost"],
            default: "new",
        },
        notes: { type: String, default: "" },
        tags: { type: [String], default: [] },
        isAiPaused: { type: Boolean, default: false },
        lastMessageAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

ConversationSchema.index({ ownerId: 1, contactNumber: 1 }, { unique: true });

const Conversation: Model<IConversation> =
    mongoose.models.Conversation ||
    model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
