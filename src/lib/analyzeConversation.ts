import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { IMessage } from "@/model/conversation.model";
import WhatsappStatus from "@/model/whatsapp-status.model";

async function clearProviderError(ownerId: string, provider: 'openai' | 'gemini' | 'grok' | 'groq') {
    await WhatsappStatus.findOneAndUpdate({ ownerId }, { $unset: { [`providerStatus.${provider}`]: "" } }).catch(() => {});
}

async function reportProviderError(ownerId: string, provider: 'openai' | 'gemini' | 'grok' | 'groq', error: any) {
    let msg = error?.status === 429 ? "Quota exceeded" : error?.status === 401 ? "Invalid API key" : error?.message || String(error);
    await WhatsappStatus.findOneAndUpdate({ ownerId }, { $set: { [`providerStatus.${provider}`]: { error: msg, updatedAt: new Date() } } }).catch(() => {});
}
 
export interface ConversationAnalysis {
    // Existing
    intent: "buying" | "inquiry" | "complaint" | "spam" | "unknown";
    urgency: "high" | "medium" | "low";
    leadScore: "hot" | "warm" | "cold";
    extractedName: string | null;
    extractedBudget: string | null;
    summary: string;
    sentiment: "positive" | "neutral" | "negative";
    // Next Best Action
    nextBestAction: string;
    nextBestActionType: "follow_up" | "send_pricing" | "close" | "nurture" | "escalate" | "none";
    // Enriched Records
    enriched: {
        company: string | null;
        location: string | null;
        email: string | null;
        language: string | null;
    };
}
 
export async function analyzeConversation(
    messages: IMessage[],
    ownerId?: string
): Promise<ConversationAnalysis | null> {
    if (!messages || messages.length === 0) return null;
 
    const recent = messages.slice(-12);
    const transcript = recent
        .map((m) => `${m.role === "customer" ? "Customer" : m.role === "owner" ? "Sales Rep" : "Bot"}: ${m.text}`)
        .join("\n");
 
    const prompt = `
You are a sales intelligence analyst. Analyze this WhatsApp customer conversation and extract ALL of the following structured data.
 
CONVERSATION:
${transcript}
 
Respond ONLY with valid JSON — no extra text, no markdown fences:
{
  "intent": "buying" | "inquiry" | "complaint" | "spam" | "unknown",
  "urgency": "high" | "medium" | "low",
  "leadScore": "hot" | "warm" | "cold",
  "extractedName": "customer first name if mentioned, else null",
  "extractedBudget": "budget or price range if mentioned in any currency, else null",
  "summary": "1-2 sentence summary of what the customer wants",
  "sentiment": "positive" | "neutral" | "negative",
  "nextBestAction": "a specific, actionable instruction for the sales rep, e.g. 'Send the product catalog and follow up in 24 hours' or 'This lead is ready to close — share payment link now'",
  "nextBestActionType": "follow_up" | "send_pricing" | "close" | "nurture" | "escalate" | "none",
  "enriched": {
    "company": "company or business name if mentioned, else null",
    "location": "city or country if mentioned, else null",
    "email": "email address if mentioned, else null",
    "language": "primary language the customer is writing in, e.g. English, Hindi, Tamil"
  }
}
 
RULES FOR EACH FIELD:
- intent "buying": ready to purchase or book
- intent "inquiry": asking questions, exploring
- intent "complaint": unhappy, has a problem
- urgency "high": urgent language, needs help now, ready to buy today
- urgency "medium": interested but not rushed
- urgency "low": casual, just browsing
- leadScore "hot": high intent + high urgency, very likely to convert
- leadScore "warm": interested but needs nurturing
- leadScore "cold": low engagement
- nextBestActionType "close": lead is ready to buy, push for payment/booking
- nextBestActionType "send_pricing": customer needs pricing info
- nextBestActionType "follow_up": schedule a check-in
- nextBestActionType "nurture": keep engaging, not ready yet
- nextBestActionType "escalate": customer is angry or needs human immediately
- nextBestActionType "none": no action needed
`;
 
    // Try OpenAI first
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey !== "your_openai_api_key_here") {
        try {
            const openai = new OpenAI({ apiKey: openaiKey });
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });
            const content = completion.choices[0].message.content;
            if (content) {
                if (ownerId) await clearProviderError(ownerId, 'openai');
                return JSON.parse(content) as ConversationAnalysis;
            }
        } catch (e: any) {
            console.error("[Analyze] OpenAI failed:", e);
            if (ownerId) await reportProviderError(ownerId, 'openai', e);
        }
    }
 

    // Try Grok next
    const grokKey = process.env.GROK_API_KEY;
    if (grokKey) {
        try {
            const grok = new OpenAI({ apiKey: grokKey, baseURL: "https://api.x.ai/v1" });
            const completion = await grok.chat.completions.create({
                model: "grok-4",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });
            const content = completion.choices[0].message.content;
            if (content) {
                if (ownerId) await clearProviderError(ownerId, 'grok');
                return JSON.parse(content) as ConversationAnalysis;
            }
        } catch (e: any) {
            console.error("[Analyze] Grok failed:", e);
            if (ownerId) await reportProviderError(ownerId, 'grok', e);
        }
    }

    // Try Groq next
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
        try {
            const groq = new OpenAI({ apiKey: groqKey, baseURL: "https://api.groq.com/openai/v1" });
            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });
            const content = completion.choices[0].message.content;
            if (content) {
                if (ownerId) await clearProviderError(ownerId, 'groq');
                return JSON.parse(content) as ConversationAnalysis;
            }
        } catch (e: any) {
            console.error("[Analyze] Groq failed:", e);
            if (ownerId) await reportProviderError(ownerId, 'groq', e);
        }
    }

    // Fallback to Gemini
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
        for (const modelName of modelsToTry) {
            try {
                const res = await (ai as any).models.generateContent({
                    model: modelName,
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                });
                    if (res?.text) {
                    let cleaned = res.text.trim();
                    if (cleaned.startsWith("\`\`\`")) {
                        cleaned = cleaned.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\`\`\`\s*$/, "").trim();
                    }
                    if (ownerId) await clearProviderError(ownerId, 'gemini');
                    return JSON.parse(cleaned) as ConversationAnalysis;
                }
            } catch (e: any) { 
                if (ownerId && modelName === modelsToTry[modelsToTry.length - 1]) {
                    await reportProviderError(ownerId, 'gemini', e);
                }
                continue; 
            }
        }
    } catch (e) {
        console.error("[Analyze] Gemini failed:", e);
    }
 
    return null;
}
