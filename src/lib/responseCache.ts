import CachedResponse from "@/model/cached-response.model";

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
 * If found, increments hitCount and returns the reply.
 * Returns null if no cache hit.
 */
export async function getCachedReply(
    ownerId: string,
    question: string
): Promise<string | null> {
    try {
        const key = normalizeQuestion(question);
        if (key.length < 5) return null; // skip caching for very short inputs

        const cached = await CachedResponse.findOneAndUpdate(
            { ownerId, normalizedQuestion: key },
            { $inc: { hitCount: 1 } },
            { new: true }
        ).lean();

        if (cached) {
            console.log(`[Cache] HIT for "${key}" (hit #${cached.hitCount}) — skipping AI call`);
            return cached.reply;
        }
        return null;
    } catch (e) {
        // Never fail the main flow due to cache errors
        console.warn("[Cache] Read error:", e);
        return null;
    }
}

/**
 * Saves a new AI-generated reply to the cache.
 * Uses upsert so duplicate questions from the same owner just refresh the reply.
 */
export async function setCachedReply(
    ownerId: string,
    question: string,
    reply: string
): Promise<void> {
    try {
        const key = normalizeQuestion(question);
        if (key.length < 5 || !reply) return; // don't cache empty or trivial replies

        await CachedResponse.findOneAndUpdate(
            { ownerId, normalizedQuestion: key },
            {
                $set: {
                    reply,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // renew 7-day TTL
                },
                $setOnInsert: { ownerId, normalizedQuestion: key, hitCount: 0 },
            },
            { upsert: true }
        );
        console.log(`[Cache] SAVED reply for "${key}"`);
    } catch (e) {
        // Never fail the main flow due to cache write errors
        console.warn("[Cache] Write error:", e);
    }
}
