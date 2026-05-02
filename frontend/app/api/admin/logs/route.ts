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

export async function GET(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const targetEmail = searchParams.get("targetEmail");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};
    if (action) query.action = { $regex: action, $options: "i" };
    if (targetEmail) query.targetEmail = { $regex: targetEmail, $options: "i" };

    const logs = await AuditLog.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return NextResponse.json(logs);
}
