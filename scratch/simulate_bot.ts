
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function simulate() {
    const businessName = "UseAI Student Mentorship";
    const agentInstructions = "If the customer speaks Hindi, always answer in Hindi.";
    const knowledge = `
    College Partnerships (Primary): Annual licensing model per institution. Target: ₹5-20L per college annually.
    Student Subscriptions (Secondary): Freemium model: Basic access free, premium features paid. Target: ₹499-999/month or ₹4,999-9,999/year.
    Premium Mentor Access: Top-tier mentors. Revenue share with mentors (70-30 split).
    Leadership Programs: Campus ambassador programs. Target: ₹9,999-29,999 per program.
    `;
    const customerQuestion = "App ki service ki fees kya hai?";

    const prompt = `
You are a professional customer support assistant for this business chatting on WhatsApp.
Use ONLY the business information provided below. Keep answers concise and conversational.

LANGUAGE RULE: Always respond in the SAME language the customer is using. If they write in Hindi, you MUST respond in Hindi (Devanagari script). If they use Hinglish, you can use Hinglish. If they use English, stay in English.

SPECIAL INSTRUCTIONS FROM THE BUSINESS OWNER (follow these strictly):
${agentInstructions}

IMPORTANT: Respond ONLY with valid JSON, no extra text:
{
  "canAnswer": true or false,
  "reply": "your answer here"
}

BUSINESS INFORMATION:
business name: ${businessName}
knowledge: ${knowledge}

CUSTOMER QUESTION:
${customerQuestion}

JSON RESPONSE:
`;

    console.log("--- SIMULATING HINDI RESPONSE ---");
    console.log("Customer:", customerQuestion);
    
    // Using models/ prefix as seen in list_models output
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    try {
        const geminiRes = await (ai as any).models.generateContent({
            model: "models/gemini-1.5-flash",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        if (geminiRes) {
            let text = (geminiRes.text || "").trim();
            if (text.startsWith("```")) {
                text = text.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
            }
            const parsed = JSON.parse(text);
            console.log("\nBot Response (JSON):", JSON.stringify(parsed, null, 2));
            console.log("\nFinal Message for WhatsApp:");
            console.log(parsed.reply);
        }
        
    } catch (err) {
        console.error("Simulation failed:", err);
    }
}

simulate();
