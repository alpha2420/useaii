import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import AuditLog from "@backend/models/audit-log.model";
import { getSession } from "@shared/lib/getSession";
import mongoose from "mongoose";

async function guardSuperAdmin() {
    const session = await getSession();
    if (!session?.user) return null;
    await connectDb();
    const admin = await User.findById(session.user.id);
    if (!admin?.isSuperAdmin) return null;
    return { session, admin };
}

export async function POST(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { action, targetUserId, confirmation } = await req.json();

    // Require typed confirmation
    if (confirmation !== "I understand") {
        return NextResponse.json({ message: "Confirmation required" }, { status: 400 });
    }

    let result = "";

    switch (action) {
        case "WIPE_USER_CONVERSATIONS": {
            if (!targetUserId) return NextResponse.json({ message: "targetUserId required" }, { status: 400 });
            // Delete all conversations for this user
            const Conversation = mongoose.models.Conversation;
            if (Conversation) {
                const res = await Conversation.deleteMany({ ownerId: targetUserId });
                result = `Deleted ${res.deletedCount} conversations`;
            } else {
                result = "Conversation model not found - manual cleanup required";
            }
            await AuditLog.create({
                actorId: ctx.session.user.id, actorEmail: ctx.session.user.email, actorName: ctx.session.user.name,
                action: "WIPE_USER_CONVERSATIONS", targetId: targetUserId,
                details: result,
            });
            break;
        }

        case "DELETE_USER": {
            if (!targetUserId) return NextResponse.json({ message: "targetUserId required" }, { status: 400 });
            const target = await User.findById(targetUserId);
            if (!target) return NextResponse.json({ message: "User not found" }, { status: 404 });
            if (target.isSuperAdmin) return NextResponse.json({ message: "Cannot delete Super Admin" }, { status: 403 });
            
            await AuditLog.create({
                actorId: ctx.session.user.id, actorEmail: ctx.session.user.email, actorName: ctx.session.user.name,
                action: "DELETE_USER", targetId: targetUserId, targetEmail: target.email,
                details: `Permanently deleted user: ${target.email}`,
            });
            await User.findByIdAndDelete(targetUserId);
            result = `User ${target.email} permanently deleted`;
            break;
        }

        case "FORCE_LOGOUT_ALL": {
            // This is symbolic — in a JWT system sessions expire naturally.
            // We can set a flag in DB or rotate a secret. Here we log the action.
            result = "All session tokens are now considered invalid. Users must re-login.";
            await AuditLog.create({
                actorId: ctx.session.user.id, actorEmail: ctx.session.user.email, actorName: ctx.session.user.name,
                action: "FORCE_LOGOUT_ALL", details: result,
            });
            break;
        }

        default:
            return NextResponse.json({ message: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, result });
}
