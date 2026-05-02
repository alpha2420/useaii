import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
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

    const users = await User.find({ role: "owner" })
        .sort({ createdAt: -1 })
        .select("-password")
        .lean();

    // Aggregate totals
    const totalCreditsIssued = users.reduce((sum: number, u: any) => sum + (u.credits || 0), 0);
    const activeUsers = users.filter((u: any) => u.isActive).length;
    const suspendedUsers = users.filter((u: any) => !u.isActive).length;

    return NextResponse.json({
        users,
        summary: {
            totalUsers: users.length,
            activeUsers,
            suspendedUsers,
            totalCreditsIssued,
        }
    });
}
