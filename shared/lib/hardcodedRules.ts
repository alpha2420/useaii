/**
 * Elite 50-Query Hardcoded Rule Engine
 * Bypasses AI/RAG for the most common business queries.
 */

export interface HardcodedRule {
    intent: string;
    patterns: string[];
}

export const ELITE_RULES: HardcodedRule[] = [
    // 💰 Pricing
    { intent: "pricing", patterns: ["price", "pricing", "cost", "how much", "subscription", "fee", "charges", "plan", "package", "cheapest", "premium"] },
    // 📍 Location
    { intent: "location", patterns: ["location", "address", "where are you", "office", "branch", "visit", "directions", "city"] },
    // ⏰ Timing
    { intent: "timing", patterns: ["timing", "hours", "open", "close", "working hours", "available", "schedule", "when are you"] },
    // 📞 Contact
    { intent: "contact", patterns: ["contact", "reach", "email", "phone", "whatsapp", "talk to", "speak to", "human", "agent", "number"] },
    // 💳 Payments
    { intent: "payments", patterns: ["upi", "accept", "pay", "payment methods", "cod", "cash on delivery", "emi", "card", "bank transfer"] },
    // 🔁 Refund / Policy
    { intent: "refund", patterns: ["refund", "cancel", "return policy", "money back", "cancellation", "refund status", "refund time"] },
    // 🚀 Product / Features
    { intent: "services", patterns: ["what do you do", "features", "services", "how it works", "use case", "capabilities", "offerings"] },
    // 🎯 Sales Intent
    { intent: "onboarding", patterns: ["demo", "book call", "schedule", "get started", "signup", "trial", "test account"] },
    // 🛠️ Support
    { intent: "technical", patterns: ["not working", "issue", "error", "bug", "help", "broken", "problem", "cannot", "fix"] },
    // ⚖️ Comparison
    { intent: "comparison", patterns: ["compare", "why you", "vs", "better than", "competitor", "difference"] }
];

/**
 * Matches a message against the hardcoded patterns.
 * Returns the intent if matched.
 */
export function matchHardcodedIntent(message: string): string | null {
    const cleanMsg = message.toLowerCase().trim();
    for (const rule of ELITE_RULES) {
        for (const pattern of rule.patterns) {
            if (cleanMsg.includes(pattern)) {
                return rule.intent;
            }
        }
    }
    return null;
}
