import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import { getSession } from "@shared/lib/getSession";

// List all users
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDb();
        const admin = await User.findById(session.user.id);
        if (!admin || !admin.isSuperAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const users = await User.find({ role: "owner" })
            .sort({ createdAt: -1 })
            .select("-password")
            .lean();

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

// Update user credits or status
export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDb();
        const admin = await User.findById(session.user.id);
        if (!admin || !admin.isSuperAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const { targetUserId, credits, isActive } = await req.json();
        
        const updates: any = {};
        if (credits !== undefined) updates.credits = credits;
        if (isActive !== undefined) updates.isActive = isActive;

        const updated = await User.findByIdAndUpdate(targetUserId, { $set: updates }, { new: true }).select("-password");

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
