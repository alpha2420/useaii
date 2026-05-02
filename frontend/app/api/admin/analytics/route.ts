import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import UsageLog from "@backend/models/usage-log.model";
import Conversation from "@backend/models/conversation.model";
import { getSession } from "@shared/lib/getSession";

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

        // 1. Global Overview
        const totalBusinesses = await User.countDocuments({ role: "owner" });
        const totalConversations = await Conversation.countDocuments();
        
        const msgAggregation = await Conversation.aggregate([
            { $project: { msgCount: { $size: "$messages" } } },
            { $group: { _id: null, total: { $sum: "$msgCount" } } }
        ]);
        const totalMessages = msgAggregation[0]?.total || 0;

        const tokenAggregation = await UsageLog.aggregate([
            { $group: { _id: null, total: { $sum: "$totalTokens" } } }
        ]);
        const totalTokens = tokenAggregation[0]?.total || 0;

        // 2. Usage Trends (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const usageTrends = await UsageLog.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    requests: { $sum: 1 },
                    tokens: { $sum: "$totalTokens" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 3. Model Distribution
        const modelDistribution = await UsageLog.aggregate([
            {
                $group: {
                    _id: "$model",
                    requests: { $sum: 1 }
                }
            },
            { $sort: { requests: -1 } }
        ]);

        // 4. Intent Breakdown
        const intentBreakdown = await Conversation.aggregate([
            {
                $group: {
                    _id: "$intent",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 5. Business Leaderboard
        const leaderboardRaw = await Conversation.aggregate([
            {
                $group: {
                    _id: "$ownerId",
                    conversationCount: { $sum: 1 },
                    hotLeads: { $sum: { $cond: [{ $eq: ["$leadScore", "hot"] }, 1, 0] } }
                }
            },
            { $sort: { conversationCount: -1 } },
            { $limit: 10 }
        ]);

        const ownerIds = leaderboardRaw.map(b => b._id);
        const owners = await User.find({ _id: { $in: ownerIds } }, 'email name').lean();
        const ownerMap = owners.reduce((acc: any, curr) => ({...acc, [curr._id.toString()]: curr}), {});
        
        const businessLeaderboard = leaderboardRaw.map(b => ({
            _id: b._id,
            conversationCount: b.conversationCount,
            hotLeads: b.hotLeads,
            ownerName: ownerMap[b._id]?.name || 'Unknown',
            ownerEmail: ownerMap[b._id]?.email || 'Unknown'
        }));

        // 6. Recent Hot Leads
        const recentHotLeads = await Conversation.find({ leadScore: "hot" })
            .sort({ lastAnalyzedAt: -1, updatedAt: -1 })
            .limit(5)
            .select('contactNumber intent summary extractedName extractedBudget enriched updatedAt ownerId')
            .lean();
            
        // Map owners to recent hot leads
        const leadOwnerIds = recentHotLeads.map(l => l.ownerId);
        const leadOwners = await User.find({ _id: { $in: leadOwnerIds } }, 'name').lean();
        const leadOwnerMap = leadOwners.reduce((acc: any, curr) => ({...acc, [curr._id.toString()]: curr.name}), {});
        
        const enrichedRecentHotLeads = recentHotLeads.map(lead => ({
            ...lead,
            ownerName: leadOwnerMap[lead.ownerId] || 'Unknown'
        }));

        return NextResponse.json({
            globalOverview: {
                totalBusinesses,
                totalConversations,
                totalMessages,
                totalTokens
            },
            usageTrends,
            modelDistribution,
            intentBreakdown,
            businessLeaderboard,
            recentHotLeads: enrichedRecentHotLeads
        });
    } catch (error) {
        console.error("[Admin Analytics]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
