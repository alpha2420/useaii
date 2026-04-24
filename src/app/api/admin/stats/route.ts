import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import UsageLog from "@/model/usage-log.model";
import { getSession } from "@/lib/getSession";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDb();
        const admin = await User.findById(session.user.id);
        
        // SECURE: Only allow Super Admins
        if (!admin || !admin.isSuperAdmin) {
            return NextResponse.json({ message: "Forbidden: Super Admin only" }, { status: 403 });
        }

        // 1. Total Users
        const totalUsers = await User.countDocuments({ role: "owner" });
        
        // 2. Global Token Usage
        const usage = await UsageLog.aggregate([
            {
                $group: {
                    _id: null,
                    totalTokens: { $sum: "$totalTokens" },
                    totalPrompt: { $sum: "$promptTokens" },
                    totalCompletion: { $sum: "$completionTokens" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Usage by Model
        const modelStats = await UsageLog.aggregate([
            {
                $group: {
                    _id: "$model",
                    tokens: { $sum: "$totalTokens" },
                    requests: { $sum: 1 }
                }
            },
            { $sort: { tokens: -1 } }
        ]);

        // 4. Recent Logs
        const recentLogs = await UsageLog.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            stats: {
                totalUsers,
                totalTokens: usage[0]?.totalTokens || 0,
                totalRequests: usage[0]?.count || 0,
                promptTokens: usage[0]?.totalPrompt || 0,
                completionTokens: usage[0]?.totalCompletion || 0,
            },
            modelStats,
            recentLogs
        });
    } catch (error) {
        console.error("[Admin Stats]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
