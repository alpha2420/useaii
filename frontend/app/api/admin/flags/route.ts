import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import AuditLog from "@backend/models/audit-log.model";
import { getSession } from "@shared/lib/getSession";
import mongoose, { model, Schema } from "mongoose";

// Inline SystemFlags model
const flagsSchema = new Schema({ key: { type: String, unique: true }, value: Schema.Types.Mixed }, { timestamps: true });
const SystemFlag = mongoose.models.SystemFlag || model("SystemFlag", flagsSchema);

const DEFAULT_FLAGS = [
    { key: "allow_registration", label: "Allow New Registrations", description: "Allow new users to sign up", value: true },
    { key: "whatsapp_enabled", label: "WhatsApp Integration", description: "Enable WhatsApp bot for all users", value: true },
    { key: "ai_caching_enabled", label: "AI Response Caching", description: "Cache repeated questions to save API tokens", value: true },
    { key: "maintenance_mode", label: "Maintenance Mode", description: "Show a banner to all users on the dashboard", value: false },
];

async function guardSuperAdmin() {
    const session = await getSession();
    if (!session?.user) return null;
    await connectDb();
    const admin = await User.findById(session.user.id);
    if (!admin?.isSuperAdmin) return null;
    return { session, admin };
}

export async function GET(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // Seed defaults if not present
    for (const flag of DEFAULT_FLAGS) {
        await SystemFlag.updateOne({ key: flag.key }, { $setOnInsert: { value: flag.value } }, { upsert: true });
    }

    const flags = await SystemFlag.find({}).lean();
    const merged = DEFAULT_FLAGS.map(d => {
        const saved = flags.find((f: any) => f.key === d.key);
        return { ...d, value: saved ? saved.value : d.value };
    });

    return NextResponse.json(merged);
}

export async function PATCH(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ message: "Missing key" }, { status: 400 });

    await SystemFlag.updateOne({ key }, { $set: { value } }, { upsert: true });

    // Log the action
    const flagMeta = DEFAULT_FLAGS.find(f => f.key === key);
    await AuditLog.create({
        actorId: ctx.session.user.id,
        actorEmail: ctx.session.user.email,
        actorName: ctx.session.user.name,
        action: "TOGGLE_FEATURE_FLAG",
        details: `Set "${flagMeta?.label || key}" to ${value}`,
    });

    return NextResponse.json({ ok: true });
}
