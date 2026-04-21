import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import UnansweredQuestion from "@/model/unanswered-question.model";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getCachedReply, setCachedReply } from "@/lib/responseCache";
import { preprocessMessage } from "@/lib/preprocessMessage";
import { getRelevantContext } from "@/lib/rag";
import Conversation from "@/model/conversation.model";

// Optional Rate Limiting Setup
let ratelimit: Ratelimit | null = null;
if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
        analytics: true,
        prefix: "@upstash/ratelimit-support-ai",
    });
} else {
    console.warn("⚠️ Rate limiting is disabled: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are missing.");
}

export async function POST(req: NextRequest) {
    try {
        const { message, ownerId, contactNumber = "web-guest" } = await req.json()
        if (!message || !ownerId) {
            return NextResponse.json(
                { message: "message and owner id is required" },
                { status: 400 }
            )
        }

        // ── Pre-process: clean slang, emojis, filler before anything else ─────────
        const cleanMessage = preprocessMessage(message);
        console.log(`[Chat] Raw: "${message}" → Clean: "${cleanMessage}"`);

        // --- Rate Limiting ---
        if (ratelimit) {
            const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
            const { success, limit, remaining, reset } = await ratelimit.limit(`chat_${ip}`);
            
            if (!success) {
                return NextResponse.json(
                    { message: "Too many requests. Please try again later." },
                    { 
                        status: 429,
                        headers: {
                            "X-RateLimit-Limit": limit.toString(),
                            "X-RateLimit-Remaining": remaining.toString(),
                            "X-RateLimit-Reset": reset.toString(),
                        }
                    }
                )
            }
        }
        // ---------------------

        await connectDb()
        const setting = await Settings.findOne({ ownerId })
        if (!setting) {
            return NextResponse.json(
                { message: "chat bot is not configured yet." },
                { status: 400 }
            )
        }

        // ── 0. Load/Create Conversation ──────────────────────────────
        let convo = await Conversation.findOne({ ownerId, contactNumber });
        if (!convo) {
            convo = await Conversation.create({
                ownerId,
                contactNumber,
                contactName: contactNumber === "web-sandbox" ? "Sandbox Tester" : "Web User",
                source: "widget",
                messages: []
            });
        }

        // Save incoming message
        await Conversation.findOneAndUpdate(
            { ownerId, contactNumber },
            { 
                $push: { messages: { role: "customer", text: message, timestamp: new Date() } },
                $set: { lastMessageAt: new Date() }
            }
        );

        // ── 1. Language Onboarding Flow (Web) ─────────────────────────
        if (!convo.preferredLanguage) {
            const hasAskedLanguage = convo.messages?.some(
                (m: any) => m.role === 'bot' && m.text.includes('1️⃣ English')
            );

            if (!hasAskedLanguage) {
                const welcomeMsg = `Welcome to *${setting.businessName || "us"}*! / नमस्ते! 🙌\n\nPlease select your preferred language to continue / कृपया जारी रखने के लिए अपनी पसंदीदा भाषा चुनें:\n\n1️⃣ English\n2️⃣ Hindi (हिंदी)\n3️⃣ Hinglish`;
                await Conversation.findOneAndUpdate(
                    { ownerId, contactNumber },
                    { $push: { messages: { role: "bot", text: welcomeMsg, timestamp: new Date() } } }
                );
                return NextResponse.json(welcomeMsg);
            } else {
                const textLower = message.trim().toLowerCase();
                let selectedLang: string | null = null;
                if (textLower === "1" || textLower.includes("english")) selectedLang = "english";
                else if (textLower === "2" || textLower.includes("hindi")) selectedLang = "hindi";
                else if (textLower === "3" || textLower.includes("hinglish")) selectedLang = "hinglish";

                if (selectedLang) {
                    await Conversation.findOneAndUpdate({ ownerId, contactNumber }, { $set: { preferredLanguage: selectedLang } });
                    convo.preferredLanguage = selectedLang;
                    const ackMsg = selectedLang === "hindi" ? "धन्यवाद! हम हिंदी में बातचीत जारी रखेंगे।" :
                                   selectedLang === "hinglish" ? "Done! Hum Hinglish mein baat karenge. 😊" :
                                   "Great! We will continue in English. 😊";
                    await Conversation.findOneAndUpdate(
                        { ownerId, contactNumber },
                        { $push: { messages: { role: "bot", text: ackMsg, timestamp: new Date() } } }
                    );
                    return NextResponse.json(ackMsg);
                } else {
                    const retryMsg = `Please choose a valid option (1, 2, or 3):\n1️⃣ English\n2️⃣ Hindi (हिंदी)\n3️⃣ Hinglish`;
                    return NextResponse.json(retryMsg);
                }
            }
        }

        // --- Greeting short-circuit (only if onboarding complete) ---
        const greetingPattern = /^\s*(hello|hi|hey|hiya|howdy|greetings|sup|what'?s up|good (morning|afternoon|evening))\s*[!.?]?\s*$/i;
        if (greetingPattern.test(message)) {
            const businessName = setting.businessName || "us";
            const greetingReply = `Hello! 👋 Welcome back to ${businessName}. How can I help you today?`;
            return NextResponse.json(greetingReply);
        }
        // ------------------------------

        // ── Cache Check (skip AI entirely if question was answered before) ─────
        // const cachedAnswer = await getCachedReply(ownerId, cleanMessage);
        // if (cachedAnswer) {
        //     console.log(`[Chat] Cache hit for owner ${ownerId} — no AI call.`);
        //     const cachedResponse = NextResponse.json(cachedAnswer);
        //     cachedResponse.headers.set("Access-Control-Allow-Origin", "*");
        //     cachedResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        //     cachedResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
        //     return cachedResponse;
        // }
        // ────────────────────────────────────────────────────────────────────

        // Truncate knowledge to 800 chars max to reduce input tokens
        const knowledgeTrimmed = (setting.knowledge || "not provided").slice(0, 800);
        
        // Fetch specific relevant context via Vector Search (RAG)
        const ragContext = await getRelevantContext(cleanMessage, ownerId);

        const mediaLinks = setting.mediaLinks || [];
        const MEDIA_LINKS_CONTEXT = mediaLinks.length > 0
            ? `\n\n--- MEDIA & PHOTO LINKS ---\n${mediaLinks.map((l: any) => `${l.name} -> ${l.url}`).join("\n")}`
            : "";

        const KNOWLEDGE = `name: ${setting.businessName || "not provided"} | email: ${setting.supportEmail || "not provided"} | info: ${knowledgeTrimmed}\n\n${ragContext}${MEDIA_LINKS_CONTEXT}`;

        const AGENT_INSTRUCTIONS = setting.agentInstructions
            ? `\nSPECIAL INSTRUCTIONS FROM THE BUSINESS OWNER (follow strictly):\n${setting.agentInstructions}\n`
            : "";

        const languageRule = convo.preferredLanguage === "hindi" 
            ? "STRICT LANGUAGE RULE: You MUST reply exclusively in Hindi using the Devanagari script." 
            : convo.preferredLanguage === "hinglish" 
            ? "STRICT LANGUAGE RULE: You MUST reply exclusively in Hinglish (Hindi written in the English alphabet, conversational)." 
            : "STRICT LANGUAGE RULE: You MUST reply exclusively in English.";

        const prompt = `You are a warm, highly empathetic, and conversational human support agent. Reply JSON: {"canAnswer":true/false,"reply":"answer"}
RULES:
1. Speak in a natural, polite, and friendly human voice. Match the customer's conversational tone.
2. Be EXTREMELY short and direct. Max 1 sentence (under 15 words) UNLESS providing requested details. NO polite filler phrases (e.g. "Absolutely!", "I can help with that"). Just get straight to the point. Use 1 organic emoji.
3. NEVER send links, addresses, or pricing without being asked.
4. STRICT LINK RULE: If the customer asks for a specific link (e.g. "send photos of hostel", "where is the location"), you MUST identify the ONE relevant link from the INFO and send only that. NEVER send multiple links at once. If you find multiple matches, ask for clarification (e.g., "Which hostel would you like photos for?").
5. Answer ONLY the exact question asked and NOTHING else. Do not hallucinate links.
6. ${languageRule}
${AGENT_INSTRUCTIONS}
INFO: ${KNOWLEDGE}
Q: ${cleanMessage}`;

        let reply = "";
        let canAnswer = true;
        let aiSuccess = false;

        // --- 1. Try Gemini (Primary) ---
        if (env.GEMINI_API_KEY && env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
            const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
            const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
            let geminiRes: any = null;

            for (const modelName of modelsToTry) {
                try {
                    console.log(`[Chat] Trying Gemini model: ${modelName} for owner ${ownerId}`);
                    geminiRes = await (ai as any).models.generateContent({
                        model: modelName,
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                        generationConfig: { maxOutputTokens: 120 }
                    });
                    if (geminiRes) {
                        const usage = (geminiRes as any).usageMetadata;
                        console.log(`[Chat] Gemini success | ${modelName} | Tokens: In=${usage?.promptTokenCount}, Out=${usage?.candidatesTokenCount}, Total=${usage?.totalTokenCount}`);
                        break;
                    }
                } catch (apiError: unknown) {
                    console.error(`[Chat] Gemini model ${modelName} failed:`, (apiError as any)?.status || (apiError as any)?.message || apiError);
                }
            }

            if (geminiRes) {
                const rawReply = geminiRes.text || "Something went wrong.";
                try {
                    let cleaned = rawReply.trim();
                    if (cleaned.startsWith("```")) {
                        cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
                    }
                    const parsed = JSON.parse(cleaned);
                    canAnswer = parsed.canAnswer !== false;
                    reply = parsed.reply || rawReply;
                } catch {
                    canAnswer = true;
                    reply = rawReply;
                }
                aiSuccess = true;
            }
        }

        // --- 2. Fallback to OpenAI ---
        if (!aiSuccess && env.OPENAI_API_KEY && env.OPENAI_API_KEY !== "your_openai_api_key_here") {
            try {
                console.log(`[Chat] Trying OpenAI (gpt-4o-mini) for owner ${ownerId}`);
                const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    max_tokens: 120,
                });

                const content = completion.choices[0].message.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    canAnswer = parsed.canAnswer !== false;
                    reply = parsed.reply || "";
                    aiSuccess = true;
                    const usage = completion.usage;
                    console.log(`[Chat] OpenAI success | Tokens: In=${usage?.prompt_tokens}, Out=${usage?.completion_tokens}, Total=${usage?.total_tokens}`);
                }
            } catch (openaiError: unknown) {
                console.error(`[Chat] OpenAI failed:`, (openaiError as any)?.message || openaiError);
            }
        }

        if (!aiSuccess) {
            console.error("[Chat] All AI models (OpenAI & Gemini) failed for owner:", ownerId);
            return NextResponse.json(
                { message: "The AI service is temporarily overloaded. Please try again in 1-2 minutes." },
                { status: 503 }
            );
        }

        // If the AI couldn't answer, store as unanswered
        if (!canAnswer) {
            try {
                await UnansweredQuestion.create({
                    ownerId,
                    question: message,
                    source: "widget",
                    status: "unanswered"
                });
            } catch (dbErr) {
                console.error("[Chat] Failed to store unanswered question:", dbErr);
            }
        }

        // Save to cache for future reuse (only if AI could answer)
        // if (canAnswer && reply) {
        //     setCachedReply(ownerId, message, reply).catch(() => {});
        // }

        const response = NextResponse.json(reply)
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("X-Frame-Options", "DENY");
        return response

    } catch (error) {
        console.error("Chat API error:", error);
        const errResponse = NextResponse.json(
            { message: "An internal server error occurred processing the chat." },
            { status: 500 }
        )
        errResponse.headers.set("Access-Control-Allow-Origin", "*");
        errResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        errResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return errResponse
    }
}

export const OPTIONS = async () => {
    return NextResponse.json(null, {
        status: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    })
}