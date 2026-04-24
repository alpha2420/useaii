import UsageLog from "@/model/usage-log.model";
import User from "@/model/user.model";
import connectDb from "@/lib/db";

export async function logUsage({
    userId,
    model,
    promptTokens,
    completionTokens,
    type
}: {
    userId: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    type: "chat" | "refine" | "classify";
}) {
    try {
        await connectDb();
        const totalTokens = promptTokens + completionTokens;
        
        // 1. Create the log entry
        await UsageLog.create({
            userId,
            model,
            promptTokens,
            completionTokens,
            totalTokens,
            type,
            timestamp: new Date()
        });

        // 2. Deduct from user's credits
        await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { credits: -totalTokens } }
        );

        console.log(`[Usage] Logged ${totalTokens} tokens for user ${userId} using ${model}`);
    } catch (error) {
        console.error("[Usage] Error logging usage:", error);
    }
}
