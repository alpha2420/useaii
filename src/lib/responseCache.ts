import CachedResponse from "@/model/cached-response.model";
import { getEmbedding, cosineSimilarity } from "./embeddings";

/**
 * Normalizes a question into a consistent cache key.
 * "What's your REFUND Policy??" → "whats your refund policy"
 */
export function normalizeQuestion(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // strip punctuation
        .replace(/\s+/g, " ")         // collapse whitespace
        .trim()
        .slice(0, 150);               // cap key length to 150 chars
}

/**
 * Checks if a cached reply exists for this owner + question.
 * Now uses Semantic Matching (Embeddings) if exact match fails.
 */
export async function getCachedReply(
    ownerId: string,
    question: string,
    existingEmbedding?: number[],
    intent?: string
): Promise<string | null> {
    try {
        const key = normalizeQuestion(question);
        if (key.length < 3) return null;

        // 1. Intent-Bucket Match (Highest Hit Rate)
        if (intent && intent !== "unknown") {
            const intentMatch = await CachedResponse.findOneAndUpdate(
                { ownerId, intent },
                { $inc: { hitCount: 1 } },
                { new: true, sort: { updatedAt: -1 } }
            ).lean();

            if (intentMatch) {
                console.log(`[Cache] INTENT bucket hit for "${intent}"`);
                return intentMatch.reply;
            }
        }

        // 2. Exact Match Check (Fastest)
        const exactMatch = await CachedResponse.findOneAndUpdate(
            { ownerId, normalizedQuestion: key },
            { $inc: { hitCount: 1 } },
            { new: true }
        ).lean();

        if (exactMatch) {
            console.log(`[Cache] EXACT hit for "${key}"`);
            return exactMatch.reply;
        }

        // 3. Semantic Match Check (Using Vectors)
        const queryEmbedding = existingEmbedding || await getEmbedding(question);
        
        // Fetch recent caches for this owner to compare similarities
        const recentCaches = await CachedResponse.find({ ownerId })
            .sort({ updatedAt: -1 })
            .limit(40)
            .lean();

        for (const cache of recentCaches) {
            const similarity = cosineSimilarity(queryEmbedding, cache.questionEmbedding);
            if (similarity > 0.88) {
                console.log(`[Cache] SEMANTIC hit! Similarity: ${similarity.toFixed(3)} | Match: "${cache.normalizedQuestion}"`);
                await CachedResponse.updateOne({ _id: cache._id }, { $inc: { hitCount: 1 } });
                return cache.reply;
            }
        }
        
        return null;
    } catch (e) {
        console.warn("[Cache] Read error:", e);
        return null;
    }
}

/**
 * Saves a new AI-generated reply to the cache with its vector embedding and optional intent bucket.
 */
export async function setCachedReply(
    ownerId: string,
    question: string,
    reply: string,
    existingEmbedding?: number[],
    intent?: string
): Promise<void> {
    try {
        const key = normalizeQuestion(question);
        if (key.length < 3 || !reply) return;

        const embedding = existingEmbedding || await getEmbedding(question);

        await CachedResponse.findOneAndUpdate(
            { ownerId, normalizedQuestion: key },
            {
                $set: {
                    reply,
                    intent: intent && intent !== "unknown" ? intent : undefined,
                    questionEmbedding: embedding,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Refresh TTL
                },
                $setOnInsert: { ownerId, normalizedQuestion: key, hitCount: 0 },
            },
            { upsert: true }
        );
        if (intent && intent !== "unknown") {
            console.log(`[Cache] SAVED canonical reply for bucket: "${intent}"`);
        } else {
            console.log(`[Cache] SAVED semantic reply for "${key}"`);
        }
    } catch (e) {
        console.warn("[Cache] Write error:", e);
    }
}

