import { Client, LocalAuth } from 'whatsapp-web.js';
import { GoogleGenAI } from "@google/genai";
import connectDb from './db';
import Settings from '@/model/settings.model';
import UnansweredQuestion from '@/model/unanswered-question.model';
import fs from 'fs';
import path from 'path';

// Global cache for WhatsApp clients to prevent zombie processes during hot reloads
declare global {
    var whatsappClients: Map<string, Client>;
    var whatsappQRs: Map<string, string>;
    var whatsappReady: Map<string, boolean>;
}

if (!global.whatsappClients) {
    global.whatsappClients = new Map();
    global.whatsappQRs = new Map();
    global.whatsappReady = new Map();
}

export const getWhatsAppClient = (ownerId: string): Client => {
    if (global.whatsappClients.has(ownerId)) {
        return global.whatsappClients.get(ownerId)!;
    }

    const sessionPath = path.join(process.cwd(), '.wwebjs_auth', `session-${ownerId}`);

    // If client is missing but folder exists, it might be a zombie lock. Clean it.
    if (!global.whatsappReady.get(ownerId) && fs.existsSync(sessionPath)) {
        try {
            console.log(`[WhatsApp] Clearing potential zombie session at ${sessionPath}`);
            fs.rmSync(sessionPath, { recursive: true, force: true });
        } catch (e) {
            console.error(`[WhatsApp] Critical: Could not clear session lock at ${sessionPath}`, e);
        }
    }

    // Initialize new client
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: ownerId }),
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1014587000-alpha.html',
        },
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled' 
            ],
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
    });

    global.whatsappClients.set(ownerId, client);
    global.whatsappReady.set(ownerId, false);

    client.on('qr', (qr) => {
        console.log(`[WhatsApp] QR Code generated for owner: ${ownerId}`);
        global.whatsappQRs.set(ownerId, qr);
    });

    client.on('ready', () => {
        console.log(`[WhatsApp] Client is ready for owner: ${ownerId}`);
        global.whatsappReady.set(ownerId, true);
        global.whatsappQRs.delete(ownerId); // Clear QR once ready
    });

    client.on('disconnected', (reason) => {
        console.log(`[WhatsApp] Disconnected for owner: ${ownerId}. Reason: ${reason}`);
        global.whatsappReady.set(ownerId, false);
        global.whatsappClients.delete(ownerId);
        client.destroy();
    });

    client.on('message', async (msg) => {
        try {
            // Ignore status broadcasts and group messages
            if (msg.isStatus || (await msg.getChat()).isGroup) return;

            await connectDb();
            const setting = await Settings.findOne({ ownerId });
            
            if (!setting) {
                console.log(`[WhatsApp] No settings found for owner: ${ownerId}`);
                return;
            }

            const KNOWLEDGE = `
            business name- ${setting.businessName || "not provided"}
            supportEmail- ${setting.supportEmail || "not provided"}
            knowledge- ${setting.knowledge || "not provided"}
            whatsappNumber- ${setting.whatsappNumber || "not provided"}
            `;

            const prompt = `
You are a professional customer support assistant for this business chatting directly with a customer on WhatsApp.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.
Keep answers concise and conversational, suited for a WhatsApp text message.

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
${msg.body}

--------------------
JSON RESPONSE
--------------------
`;

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
            const res = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            let reply = res.text || "Something went wrong.";
            let canAnswer = true;

            try {
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

            // Store unanswered question
            if (!canAnswer) {
                try {
                    await UnansweredQuestion.create({
                        ownerId,
                        question: msg.body,
                        source: "whatsapp",
                        status: "unanswered"
                    });
                } catch (dbErr) {
                    console.error("[WhatsApp] Failed to store unanswered question:", dbErr);
                }
            }

            if (reply) {
                await msg.reply(reply);
            }

        } catch (error) {
            console.error(`[WhatsApp] Message handling error for owner ${ownerId}:`, error);
        }
    });

    // Start the client asynchronously
    client.initialize().catch(async err => {
        console.error(`[WhatsApp] Initialization failed for owner: ${ownerId}`, err);
        global.whatsappClients.delete(ownerId);
        global.whatsappReady.set(ownerId, false);
        global.whatsappQRs.delete(ownerId);
        
        // If it failed because of a browser lock, wipe the directory so the next poll succeeds
        if (err.message?.includes('already running')) {
            try {
                if (fs.existsSync(sessionPath)) {
                    fs.rmSync(sessionPath, { recursive: true, force: true });
                }
            } catch (e) {}
        }
        
        try { await client.destroy(); } catch (e) {}
    });

    return client;
};

export const getWhatsAppStatus = (ownerId: string) => {
    return {
        isReady: global.whatsappReady.get(ownerId) || false,
        qrCode: global.whatsappQRs.get(ownerId) || null
    };
};

export const disconnectWhatsApp = async (ownerId: string) => {
    const client = global.whatsappClients?.get(ownerId);
    if (!client) return { success: true };

    try {
        await client.logout();
        await client.destroy();
    } catch (e) {
        console.error(`[WhatsApp] Error disconnecting ${ownerId}`, e);
        // Force destruction even if logout fails
        try { await client.destroy(); } catch (ign) {}
    }

    global.whatsappReady?.set(ownerId, false);
    global.whatsappQRs?.delete(ownerId);
    global.whatsappClients?.delete(ownerId);

    // Hard-delete the physical session directory to wipe zombie locks
    try {
        const sessionPath = path.join(process.cwd(), '.wwebjs_auth', `session-${ownerId}`);
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }
    } catch (fsError) {
        console.error(`[WhatsApp] Failed to delete session folder for ${ownerId}`, fsError);
    }

    return { success: true };
};
