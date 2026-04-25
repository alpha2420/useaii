import connectDb from "@shared/lib/db";
import UnansweredQuestion from "@backend/models/unanswered-question.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Returns smart insights on unanswered questions:
 * - Top missing FAQs ranked by frequency
 * - Grouped by category
 * - Unique question groups (deduped by similarGroup)
 */
export async function GET(req: NextRequest) {
    try {
        const ownerId = req.nextUrl.searchParams.get("ownerId");
        if (!ownerId) {
            return NextResponse.json({ message: "ownerId is required" }, { status: 400 });
        }

        await connectDb();

        // Aggregate: for each similarGroup, get the representative question + total frequency + category
        const insights = await UnansweredQuestion.aggregate([
            {
                $match: {
                    ownerId,
                    status: "unanswered",
                    similarGroup: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: "$similarGroup",
                    representativeQuestion: { $first: "$question" },
                    totalFrequency: { $sum: "$frequency" },
                    category: { $first: "$category" },
                    latestAt: { $max: "$updatedAt" },
                    count: { $sum: 1 } // how many variations exist
                }
            },
            { $sort: { totalFrequency: -1 } }, // Sort by most asked
            { $limit: 20 }
        ]);

        // Category breakdown
        const categoryBreakdown = await UnansweredQuestion.aggregate([
            { $match: { ownerId, status: "unanswered" } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: "$frequency" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        return NextResponse.json({
            topMissingFAQs: insights,
            categoryBreakdown,
            totalUniqueGaps: insights.length,
        });
    } catch (error) {
        console.error("Insights API error:", error);
        return NextResponse.json(
            { message: "Failed to generate insights." },
            { status: 500 }
        );
    }
}
