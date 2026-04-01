import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import UnansweredQuestion from "@/model/unanswered-question.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message, ownerId } = await req.json()
        if (!message || !ownerId) {
            return NextResponse.json(
                { message: "message and owner id is required" },
                { status: 400 }
            )
        }
        await connectDb()
        const setting = await Settings.findOne({ ownerId })
        if (!setting) {
            return NextResponse.json(
                { message: "chat bot is not configured yet." },
                { status: 400 }
            )
        }

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

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let reply = res.text || "Something went wrong.";
        let canAnswer = true;

        try {
            // Clean markdown code fences if present
            let cleaned = reply.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
            }
            const parsed = JSON.parse(cleaned);
            canAnswer = parsed.canAnswer !== false;
            reply = parsed.reply || reply;
        } catch {
            // If JSON parsing fails, treat as answerable (fallback to raw text)
            canAnswer = true;
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
        return response

    } catch (error) {
        const response = NextResponse.json(
            { message: `chat error ${error}` },
            { status: 500 }
        )
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return response
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