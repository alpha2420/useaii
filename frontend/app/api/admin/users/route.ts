import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import AuditLog from "@backend/models/audit-log.model";
import { getSession } from "@shared/lib/getSession";

async function guardSuperAdmin() {
    const session = await getSession();
    if (!session?.user) return null;
    await connectDb();
    const admin = await User.findById(session.user.id);
    if (!admin?.isSuperAdmin) return null;
    return { session, admin };
}

// List all users
export async function GET(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const users = await User.find({ role: "owner" })
        .sort({ createdAt: -1 })
        .select("-password")
        .lean();

    return NextResponse.json(users);
}

// Update user credits, status, or role
export async function PATCH(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { targetUserId, credits, isActive, role } = await req.json();

    const updates: any = {};
    if (credits !== undefined) updates.credits = credits;
    if (isActive !== undefined) updates.isActive = isActive;
    if (role !== undefined) updates.role = role;

    const target = await User.findById(targetUserId).select("-password");
    if (!target) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const updated = await User.findByIdAndUpdate(targetUserId, { $set: updates }, { new: true }).select("-password");

    // Log the action
    let actionLabel = "UPDATE_USER";
    let details = "";
    if (isActive !== undefined) { actionLabel = isActive ? "ACTIVATE_USER" : "SUSPEND_USER"; details = `${target.email} → ${isActive ? "Active" : "Suspended"}`; }
    if (credits !== undefined) { actionLabel = "UPDATE_CREDITS"; details = `${target.email}: ${target.credits} → ${credits} credits`; }
    if (role !== undefined) { actionLabel = "CHANGE_ROLE"; details = `${target.email}: ${target.role} → ${role}`; }

    await AuditLog.create({
        actorId: ctx.session.user.id, actorEmail: ctx.session.user.email, actorName: ctx.session.user.name,
        action: actionLabel, targetId: targetUserId, targetEmail: target.email, details,
    });

    return NextResponse.json(updated);
}

// Permanently delete a user
export async function DELETE(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { targetUserId } = await req.json();
    const target = await User.findById(targetUserId);
    if (!target) return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (target.isSuperAdmin) return NextResponse.json({ message: "Cannot delete Super Admin" }, { status: 403 });

    await AuditLog.create({
        actorId: ctx.session.user.id, actorEmail: ctx.session.user.email, actorName: ctx.session.user.name,
        action: "DELETE_USER", targetId: targetUserId, targetEmail: target.email,
        details: `Permanently deleted ${target.email}`,
    });

    await User.findByIdAndDelete(targetUserId);
    return NextResponse.json({ ok: true });
}

