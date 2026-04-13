
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listGrokModels() {
    const grokKey = process.env.GROK_API_KEY;
    if (!grokKey) {
        console.error("GROK_API_KEY not found in .env.local");
        process.exit(1);
    }

    console.log("Listing available Grok models...");
    try {
        const grok = new OpenAI({ apiKey: grokKey, baseURL: "https://api.x.ai/v1" });
        const models = await grok.models.list();
        console.log("\nAvailable Models:");
        console.log(JSON.stringify(models.data, null, 2));
    } catch (e: any) {
        console.error("\nFailed to list models:");
        console.error(e?.message || e);
    }
    process.exit(0);
}

listGrokModels();
