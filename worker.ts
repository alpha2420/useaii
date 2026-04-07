// Worker script to manage WhatsApp connections independently of Next.js API Routes.
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import { GoogleGenAI } from "@google/genai";
import connectDb from './src/lib/db';
import Settings from './src/model/settings.model';
import WhatsappStatus from './src/model/whatsapp-status.model';
import UnansweredQuestion from './src/model/unanswered-question.model';

// Polyfill fetch for node environments
if (typeof global.fetch === 'undefined') {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = fetch as any; 
}

const activeClients = new Map<string, Client>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any = null;

async function initWorker() {
    console.log("[Worker] Starting WhatsApp manager...");
    await connectDb();
    store = new MongoStore({ mongoose: mongoose });
    console.log("[Worker] MongoDB Connected & MongoStore initialized.");

    // Primary Loop: Check for users who need a connection
    setInterval(pollUsers, 10000); // 10 seconds
    pollUsers(); // Initial poll
}

async function pollUsers() {
    try {
        // Poll WhatsappStatus directly — this is the user intent signal
        const statusDocs = await WhatsappStatus.find({ disconnectRequested: { $ne: true } }).lean();
        
        for (const status of statusDocs) {
            const ownerId = String(status.ownerId);
            
            // If we don't have this client running locally, start it
            if (!activeClients.has(ownerId)) {
                startClient(ownerId);
            } else {
                // Heartbeat: update lastPing for active clients
                await WhatsappStatus.findOneAndUpdate({ ownerId }, { lastPing: new Date() });
            }
        }

        // Process any pending disconnects
        const disconnectDocs = await WhatsappStatus.find({ disconnectRequested: true }).lean();
        for (const doc of disconnectDocs) {
            const ownerId = String(doc.ownerId);
            console.log(`[Worker] Disconnect requested for ${ownerId}`);
            if (activeClients.has(ownerId)) {
                const client = activeClients.get(ownerId)!;
                try { await client.logout(); } catch {}
                try { await client.destroy(); } catch {}
                activeClients.delete(ownerId);
            }
            try {
                await mongoose.connection.collection('whatsapp-RemoteAuth-' + ownerId).drop();
            } catch (err: unknown) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((err as any).code !== 26) {
                    console.error(`[Worker] Failed dropping RemoteAuth for ${ownerId}:`, err);
                }
            }
            await WhatsappStatus.deleteOne({ ownerId });
            console.log(`[Worker] Disconnected ${ownerId}`);
        }
        
    } catch (error) {
        console.error("[Worker] Polling error:", error);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function startClient(ownerId: string) {
    console.log(`[Worker] Initiating client for ${ownerId}`);
    
    const client = new Client({
        authStrategy: new RemoteAuth({
            clientId: ownerId,
            store: store,
            backupSyncIntervalMs: 300000 
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        }
    });

    activeClients.set(ownerId, client);

    client.on('qr', async (qr) => {
        console.log(`[Worker] QR generated for ${ownerId}`);
        await WhatsappStatus.findOneAndUpdate(
            { ownerId },
            { qrCode: qr, isReady: false },
            { upsert: true }
        );
    });

    client.on('ready', async () => {
        console.log(`[Worker] Client ready for ${ownerId}`);
        await WhatsappStatus.findOneAndUpdate(
            { ownerId },
            { qrCode: null, isReady: true },
            { upsert: true }
        );
    });

    client.on('remote_session_saved', () => {
        console.log(`[Worker] Session saved to MongoDB for ${ownerId}`);
    });

    client.on('disconnected', async (reason) => {
        console.log(`[Worker] Disconnected ${ownerId}: ${reason}`);
        activeClients.delete(ownerId);
        await WhatsappStatus.findOneAndUpdate(
            { ownerId },
            { isReady: false, qrCode: null }
        );
        try { await client.destroy(); } catch {}
    });

    client.on('message', async (msg) => {
        try {
            if (msg.fromMe || msg.isStatus) return;
            const chat = await msg.getChat();
            if (chat.isGroup) return;

            // Fetch fresh settings each time — so changes take effect immediately
            const setting = await Settings.findOne({ ownerId }).lean();
            if (!setting) {
                console.log(`[Worker] No settings found for ${ownerId}, skipping message.`);
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

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let res: any;
            const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
            let lastError: unknown = null;

            for (const modelName of modelsToTry) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    res = await (ai as any).models.generateContent({
                        model: modelName,
                        contents: [{ role: 'user', parts: [{ text: prompt }] }]
                    });
                    if (res) break; 
                } catch (apiError: unknown) {
                    lastError = apiError;
                }
            }

            if (!res) {
                console.error(`[Worker] All AI models failed for ${ownerId}`, lastError);
                await msg.reply("Hi! Our support assistant is temporarily unavailable. Please try again shortly. 🙏");
                return;
            }

            let reply = res.text || "Something went wrong.";
            let canAnswer = true;

            try {
                let cleaned = reply.trim();
                if (cleaned.startsWith("\`\`\`")) {
                    cleaned = cleaned.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\`\`\`\s*$/, "").trim();
                }
                const parsed = JSON.parse(cleaned);
                canAnswer = parsed.canAnswer !== false;
                reply = parsed.reply || reply;
            } catch {
                canAnswer = true;
            }

            if (!canAnswer) {
                try {
                    await UnansweredQuestion.create({
                        ownerId,
                        question: msg.body,
                        source: "whatsapp",
                        status: "unanswered"
                    });
                } catch (e) {
                    console.error("[Worker] Failed to store unanswered:", e);
                }
            }

            if (reply) {
                await msg.reply(reply);
            }

        } catch (error) {
            console.error(`[Worker] Message error for ${ownerId}:`, error);
        }
    });

    try {
        await client.initialize();
    } catch (err: unknown) {
        console.error(`[Worker] Init failed for ${ownerId}:`, err);
        activeClients.delete(ownerId);
        try { await client.destroy(); } catch {}
    }
}

// Global process handling
const cleanup = async () => {
    console.log("[Worker] Shutting down, cleaning up clients...");
    for (const client of activeClients.values()) {
        try { await client.destroy(); } catch {}
    }
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

initWorker().catch(e => console.error("Worker failed to start:", e));
