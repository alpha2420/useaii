
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testGroq() {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
        console.error("GROQ_API_KEY not found in .env.local");
        process.exit(1);
    }

    console.log("Testing Groq API connectivity...");
    try {
        const groq = new OpenAI({ apiKey: groqKey, baseURL: "https://api.groq.com/openai/v1" });
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello! Briefly state who you are and mention you are running on Groq." }
            ],
        });

        console.log("\nSuccess!");
        console.log("Response:", completion.choices[0].message.content);
    } catch (e: any) {
        console.error("\nGroq API failed:");
        console.error(e?.message || e);
        if (e?.status) console.error("Status Code:", e.status);
    }
    process.exit(0);
}

testGroq();
