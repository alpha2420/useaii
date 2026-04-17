import { IConversation } from "@/model/conversation.model";
import AICorrection from "@/model/ai-correction.model";

/**
 * Builds a structured memory block for a specific contact.
 * Injected into the AI prompt so it "remembers" who it's talking to.
 */
export async function buildMemoryContext(
    conversation: IConversation | null,
    ownerId: string
): Promise<string> {
    if (!conversation) return "";

    const parts: string[] = [];

    // ── 1. What we know about this contact ───────────────────────────────
    const contactMemory: string[] = [];

    if (conversation.extractedName) {
        contactMemory.push(`Name: ${conversation.extractedName}`);
    }
    if (conversation.enriched?.location) {
        contactMemory.push(`Location: ${conversation.enriched.location}`);
    }
    if (conversation.enriched?.company) {
        contactMemory.push(`Company: ${conversation.enriched.company}`);
    }
    if (conversation.enriched?.email) {
        contactMemory.push(`Email: ${conversation.enriched.email}`);
    }
    if (conversation.enriched?.language) {
        contactMemory.push(`Preferred language: ${conversation.enriched.language}`);
    }
    if (conversation.extractedBudget) {
        contactMemory.push(`Budget mentioned: ${conversation.extractedBudget}`);
    }
    if (conversation.intent && conversation.intent !== "unknown") {
        contactMemory.push(`Last known intent: ${conversation.intent}`);
    }
    if (conversation.leadScore) {
        contactMemory.push(`Lead score: ${conversation.leadScore}`);
    }
    if (conversation.stage && conversation.stage !== "new") {
        contactMemory.push(`CRM stage: ${conversation.stage}`);
    }
    if (conversation.notes) {
        contactMemory.push(`Owner notes: ${conversation.notes}`);
    }

    if (contactMemory.length > 0) {
        parts.push(`CUSTOMER:${contactMemory.join("|")}`);
    }

    // ── 2. Recent conversation history (last 3 messages for context) ──────
    const recentMessages = conversation.messages.slice(-3);
    if (recentMessages.length > 0) {
        const historyLines = recentMessages.map((m) => {
            const role =
                m.role === "customer" ? "C" :
                m.role === "owner" ? "S" : "B";
            const text = m.text.length > 200 ? m.text.slice(0, 200) + "..." : m.text;
            return `${role}: ${text}`;
        });
        parts.push(`HISTORY:\n${historyLines.join("\n")}`);
    }

    // ── 3. Owner corrections — what the AI learned from mistakes ─────────
    try {
        const corrections = await AICorrection.find({ ownerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        if (corrections.length > 0) {
            const correctionLines = corrections.map(
                (c) => `Q: "${c.originalQuestion}" (AI wrongly said: "${c.badReply}") → Correct Answer: "${c.correctReply}"`
            );
            parts.push(
                `LEARNED CORRECTIONS (mistakes you made before — do NOT repeat them):\n${correctionLines.join("\n")}`
            );
        }
    } catch (e) {
        // Corrections are optional — don't fail if collection doesn't exist yet
        console.warn("[Memory] Could not load corrections:", e);
    }

    if (parts.length === 0) return "";

    return `[MEMORY]\n${parts.join("\n")}\nAddress customer by name if known. Never re-ask info you already have.`;
}
