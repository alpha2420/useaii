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
 
    const recent = messages.slice(-6);
    const transcript = recent
        .map((m) => `${m.role === "customer" ? "C" : m.role === "owner" ? "S" : "B"}: ${m.text}`)
        .join("\n");
 
    const prompt = `Analyze this WhatsApp sales chat. Reply ONLY valid JSON, no markdown:
{"intent":"buying|inquiry|complaint|spam|unknown","urgency":"high|medium|low","leadScore":"hot|warm|cold","extractedName":"name or null","extractedBudget":"budget or null","summary":"1 sentence","sentiment":"positive|neutral|negative","nextBestAction":"short action","nextBestActionType":"follow_up|send_pricing|close|nurture|escalate|none","enriched":{"company":null,"location":null,"email":null,"language":"English"}}

CHAT:
${transcript}`;
 
    // Try OpenAI first
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey !== "your_openai_api_key_here") {
        try {
            const openai = new OpenAI({ apiKey: openaiKey });
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                max_tokens: 300,
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
                model: "grok-3-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                max_tokens: 300,
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
                max_tokens: 300,
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
                    generationConfig: { maxOutputTokens: 300 }
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
