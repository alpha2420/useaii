import mongoose, { model, Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
    actorId: string;
    actorEmail: string;
    actorName: string;
    action: string;
    targetId?: string;
    targetEmail?: string;
    details?: string;
    ip?: string;
    createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
    actorId:     { type: String, required: true, index: true },
    actorEmail:  { type: String, required: true },
    actorName:   { type: String, required: true },
    action:      { type: String, required: true, index: true },
    targetId:    { type: String },
    targetEmail: { type: String },
    details:     { type: String },
    ip:          { type: String },
}, { timestamps: true });

const AuditLog: Model<IAuditLog> =
    mongoose.models.AuditLog ||
    model<IAuditLog>("AuditLog", auditLogSchema);

export default AuditLog;
