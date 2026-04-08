import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import UnansweredQuestion from "@/model/unanswered-question.model";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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
        const { message, ownerId } = await req.json()
        if (!message || !ownerId) {
            return NextResponse.json(
                { message: "message and owner id is required" },
                { status: 400 }
            )
        }

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

        // --- Greeting short-circuit ---
        const greetingPattern = /^\s*(hello|hi|hey|hiya|howdy|greetings|sup|what'?s up|good (morning|afternoon|evening))\s*[!.?]?\s*$/i;
        if (greetingPattern.test(message)) {
            const businessName = setting.businessName || "us";
            const greetingReply = `Hello! 👋 Welcome to ${businessName}. How can I help you today?`;
            const response = NextResponse.json(greetingReply);
            response.headers.set("Access-Control-Allow-Origin", "*");
            response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type");
            return response;
        }
        // ------------------------------

        const KNOWLEDGE = `
        business name- ${setting.businessName || "not provided"}
        supportEmail- ${setting.supportEmail || "not provided"}
        knowledge- ${setting.knowledge || " not provided"}
        `

        const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.

IMPORTANT: You must respond ONLY with valid JSON in the exact format below, with no extra text before or after:
{
  "canAnswer": true or false,
  "reply": "your answer here"
}

Set "canAnswer" to true if the business information below contains enough detail to answer the question accurately.
Set "canAnswer" to false if the question asks about something NOT covered at all in the business information. In this case, set "reply" to a polite message like: "I'm sorry, I don't have information about that right now. Your question has been noted and someone from our team will look into it."

--------------------
BUSINESS INFORMATION
--------------------
${KNOWLEDGE}

--------------------
CUSTOMER QUESTION
--------------------
${message}

--------------------
JSON RESPONSE
--------------------
`;

        let reply = "";
        let canAnswer = true;
        let aiSuccess = false;

        // --- 1. Try OpenAI (Primary) ---
        if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== "your_openai_api_key_here") {
            try {
                console.log(`[Chat] Trying OpenAI (gpt-4o-mini) for owner ${ownerId}`);
                const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                });

                const content = completion.choices[0].message.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    canAnswer = parsed.canAnswer !== false;
                    reply = parsed.reply || "";
                    aiSuccess = true;
                    console.log(`[Chat] Success with OpenAI`);
                }
            } catch (openaiError: unknown) {
                console.error(`[Chat] OpenAI failed:`, (openaiError as any)?.message || openaiError);
            }
        }

        // --- 2. Fallback to Gemini ---
        if (!aiSuccess) {
            const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
            const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
            let lastError: unknown = null;
            let geminiRes: any = null;

            for (const modelName of modelsToTry) {
                try {
                    console.log(`[Chat] Trying Gemini model: ${modelName} for owner ${ownerId}`);
                    geminiRes = await (ai as any).models.generateContent({
                        model: modelName,
                        contents: [{ role: 'user', parts: [{ text: prompt }] }]
                    });
                    if (geminiRes) {
                        console.log(`[Chat] Success with Gemini model: ${modelName}`);
                        break;
                    }
                } catch (apiError: unknown) {
                    lastError = apiError;
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
            } else {
                console.error("[Chat] All AI models (OpenAI & Gemini) failed for owner:", ownerId, lastError);
                return NextResponse.json(
                    { message: "The AI service is temporarily overloaded. Please try again in 1-2 minutes." },
                    { status: 503 }
                );
            }
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