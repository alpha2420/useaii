
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    const modelName = "gemini-2.5-flash";
    console.log(`Testing model: ${modelName}`);
    try {
        const result = await (ai as any).models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: "Hello, who are you?" }] }],
        });
        console.log("Success!");
        console.log(result.text);
    } catch (e: any) {
        console.error("Error details:");
        console.error(JSON.stringify(e, null, 2) || e);
    }
    process.exit(0);
}
test();
