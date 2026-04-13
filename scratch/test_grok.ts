
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testGrok() {
    const grokKey = process.env.GROK_API_KEY;
    if (!grokKey) {
        console.error("GROK_API_KEY not found in .env.local");
        process.exit(1);
    }

    console.log("Testing Grok API connectivity...");
    try {
        const grok = new OpenAI({ apiKey: grokKey, baseURL: "https://api.x.ai/v1" });
        const completion = await grok.chat.completions.create({
            model: "grok-beta",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello! Briefly state who you are." }
            ],
        });

        console.log("\nSuccess!");
        console.log("Response:", completion.choices[0].message.content);
    } catch (e: any) {
        console.error("\nGrok API failed:");
        console.error(e?.message || e);
        if (e?.status) console.error("Status Code:", e.status);
    }
    process.exit(0);
}

testGrok();
