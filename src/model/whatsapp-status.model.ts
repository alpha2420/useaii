import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWhatsappStatus extends Document {
    ownerId: string;
    isReady: boolean;
    qrCode: string | null;
    disconnectRequested: boolean;
    lastPing: Date; // The worker updates this to signal it is alive
    providerStatus?: {
        openai?: { error: string; updatedAt: Date };
        gemini?: { error: string; updatedAt: Date };
        grok?: { error: string; updatedAt: Date };
        groq?: { error: string; updatedAt: Date };
    };
    createdAt: Date;
    updatedAt: Date;
}

const WhatsappStatusSchema: Schema<IWhatsappStatus> = new Schema({
    ownerId: {
        type: String,
        required: true,
        unique: true
    },
    isReady: {
        type: Boolean,
        default: false
    },
    qrCode: {
        type: String,
        default: null
    },
    disconnectRequested: {
        type: Boolean,
        default: false
    },
    lastPing: {
        type: Date,
        default: Date.now
    },
    providerStatus: {
        openai: { error: String, updatedAt: Date },
        gemini: { error: String, updatedAt: Date },
        grok: { error: String, updatedAt: Date },
        groq: { error: String, updatedAt: Date }
    }
}, {
    timestamps: true
});

const WhatsappStatus = mongoose.models.WhatsappStatus as Model<IWhatsappStatus> || mongoose.model<IWhatsappStatus>('WhatsappStatus', WhatsappStatusSchema);

export default WhatsappStatus;
