/**
 * Rule-based Intent Classifier
 * Classifies a user message into a known intent without any LLM call.
 * Returns a predefined reply string if intent is matched, or null to fall through to AI.
 */

export type Intent =
    | "pricing"
    | "location"
    | "timing"
    | "services"
    | "support_contact"
    | "refund"
    | "greeting"
    | "thanks"
    | "complaint"
    | "unknown";

interface IntentRule {
    intent: Intent;
    pattern: RegExp;
}

const INTENT_RULES: IntentRule[] = [
    {
        intent: "greeting",
        pattern: /^\s*(hello|hi|hey|hiya|howdy|greetings|sup|yo|what'?s up|good (morning|afternoon|evening))\s*[!.?]?\s*$/i,
    },
    {
        intent: "thanks",
        pattern: /^\s*(thanks|thank you|thx|ty|thank u|great|awesome|perfect|got it|okay|ok cool|sounds good)\s*[!.?]?\s*$/i,
    },
    {
        intent: "pricing",
        pattern: /\b(price|pricing|cost|how much|fee|fees|charge|charges|rate|rates|pay|payment|subscription|plan|plans|package|packages|quote)\b/i,
    },
    {
        intent: "location",
        pattern: /\b(location|address|where are you|where is|find you|your office|visit|branch|branches|directions|map|nearby)\b/i,
    },
    {
        intent: "timing",
        pattern: /\b(timing|hours|open|close|working hours|business hours|when are you|availability|available|what time|schedule)\b/i,
    },
    {
        intent: "services",
        pattern: /\b(what do you (do|offer|provide|sell)|services|products|features|what can you|capabilities|offerings)\b/i,
    },
    {
        intent: "support_contact",
        pattern: /\b(contact|reach|email|phone|call|whatsapp|talk to|speak to|human|agent|representative|support team|customer service|help desk)\b/i,
    },
    {
        intent: "refund",
        pattern: /\b(refund|cancel|cancellation|return|money back|chargeback|dispute|exchange|replacement)\b/i,
    },
    {
        intent: "complaint",
        pattern: /\b(not working|broken|bug|issue|problem|error|bad|wrong|terrible|awful|disappointed|worst|angry|upset|frustrated|useless)\b/i,
    },
];

/**
 * Classifies the given message into an Intent.
 */
export function classifyIntent(message: string): Intent {
    for (const rule of INTENT_RULES) {
        if (rule.pattern.test(message)) {
            return rule.intent;
        }
    }
    return "unknown";
}

interface KnowledgeContext {
    businessName: string;
    supportEmail: string;
    whatsappNumber?: string;
    knowledge: string;
}

/**
 * Generates a predefined reply for a classified intent by extracting info from the knowledge base.
 * Returns null if the intent requires AI or has no deterministic answer.
 */
export function getIntentReply(intent: Intent, ctx: KnowledgeContext): string | null {
    const { businessName, supportEmail, whatsappNumber, knowledge } = ctx;
    const kb = knowledge.toLowerCase();
    const contactStr = `${supportEmail || "our email"}${whatsappNumber ? ` or WhatsApp us at ${whatsappNumber}` : ""}`;

    switch (intent) {
        case "greeting":
            return `Hello! 👋 Welcome to ${businessName || "us"}. How can I help you today?`;

        case "thanks":
            return `You're welcome! 😊 Is there anything else I can help you with?`;

        case "support_contact":
            return `You can reach our support team at ${contactStr}. We're happy to help! 🙌`;

        case "refund":
            return `For refund or cancellation requests, please contact our team directly at ${contactStr}. We'll sort it out for you.`;

        case "complaint":
            return `I'm really sorry to hear that! 😔 Please reach out to our team at ${contactStr} and we'll make it right for you.`;

        case "pricing": {
            // Try to extract pricing info from KB
            const hasPricing = /\b(price|cost|\$|₹|rs|inr|pricing|fee|rate|plan)\b/i.test(kb);
            if (!hasPricing) {
                return `For pricing details, please contact us at ${contactStr} and we'll send you a quote!`;
            }
            return null; // Let AI extract precise pricing from knowledge chunks
        }

        case "location": {
            const hasLocation = /\b(address|location|street|city|located|office|branch)\b/i.test(kb);
            if (!hasLocation) {
                return `We'd love to help you find us! Please contact us at ${contactStr} for our location details.`;
            }
            return null; // Let AI extract exact address from knowledge chunks
        }

        case "timing": {
            const hasTiming = /\b(hours|am|pm|open|close|timing|schedule|availability)\b/i.test(kb);
            if (!hasTiming) {
                return `For our working hours, please contact us at ${contactStr}.`;
            }
            return null; // Let AI extract exact timings from knowledge chunks
        }

        case "services": {
            const hasServices = /\b(service|offer|provide|product|feature)\b/i.test(kb);
            if (!hasServices) {
                return `We'd love to tell you about what we offer! Please reach out at ${contactStr}.`;
            }
            return null; // Let AI summarize services from knowledge chunks
        }

        default:
            return null; // Unknown intent — pass to AI
    }
}
