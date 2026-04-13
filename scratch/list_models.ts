
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function list() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    try {
        const result = await (ai as any).models.list();
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
list();
