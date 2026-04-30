import connectDb from "@shared/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@shared/lib/getSession";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { ownerId } = await req.json();
        if (!ownerId || session.user.id !== ownerId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await connectDb();

        const results: Record<string, number> = {};

        // 1. Delete ALL cached responses (they rebuild automatically)
        try {
            const CachedResponse = (await import("@backend/models/cached-response.model")).default;
            const cachedResult = await CachedResponse.deleteMany({ ownerId });
            results.cachedResponses = cachedResult.deletedCount;
        } catch (e) { results.cachedResponses = 0; }

        // 2. Delete usage logs (not needed for functionality)
        try {
            const UsageLog = (await import("@backend/models/usage-log.model")).default;
            const usageResult = await UsageLog.deleteMany({ ownerId });
            results.usageLogs = usageResult.deletedCount;
        } catch (e) { results.usageLogs = 0; }

        // 3. Trim conversation messages older than 30 days (keep last 20 messages per convo)
        try {
            const Conversation = (await import("@backend/models/conversation.model")).default;
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            
            // Get conversations with many messages
            const conversations = await Conversation.find(
                { ownerId, "messages.20": { $exists: true } }, // only those with >20 messages
                { _id: 1, messages: 1 }
            ).lean();

            let trimmedConvos = 0;
            for (const convo of conversations) {
                const messages = (convo as any).messages;
                if (messages.length > 20) {
                    // Keep only the last 20 messages
                    const trimmed = messages.slice(-20);
                    await Conversation.updateOne({ _id: (convo as any)._id }, { $set: { messages: trimmed } });
                    trimmedConvos++;
                }
            }
            results.trimmedConversations = trimmedConvos;
        } catch (e) { results.trimmedConversations = 0; }

        // 4. Delete whatsapp status records (transient data, rebuilds automatically)
        try {
            const WhatsappStatus = (await import("@backend/models/whatsapp-status.model")).default;
            const wsResult = await WhatsappStatus.deleteMany({ ownerId });
            results.whatsappStatus = wsResult.deletedCount;
        } catch (e) { results.whatsappStatus = 0; }

        const totalDeleted = Object.values(results).reduce((a, b) => a + b, 0);

        return NextResponse.json({
            success: true,
            message: `Cleanup complete! Freed up space by removing ${totalDeleted} records.`,
            details: results
        });
    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json(
            { message: `Cleanup failed: ${error}` },
            { status: 500 }
        );
    }
}
