// Worker script to manage WhatsApp connections independently of Next.js API Routes.
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import connectDb from './src/lib/db';
import Settings from './src/model/settings.model';
import WhatsappStatus from './src/model/whatsapp-status.model';
import UnansweredQuestion from './src/model/unanswered-question.model';
import Conversation from './src/model/conversation.model';
import PendingMessage from './src/model/pending-message.model';
import { analyzeConversation } from './src/lib/analyzeConversation';

if (typeof global.fetch === 'undefined') {
    global.fetch = fetch as any;
}

const activeClients = new Map<string, Client>();
let store: any = null;

async function initWorker() {
    console.log("[Worker] Starting WhatsApp manager...");
    await connectDb();
    store = new MongoStore({ mongoose: mongoose });
    console.log("[Worker] MongoDB Connected & MongoStore initialized.");

    setInterval(pollUsers, 5000);
    setInterval(pollPendingMessages, 3000);
    pollUsers();
}

// ─── Poll for connect / disconnect requests ───────────────────────────────────
async function pollUsers() {
    try {
        const statusDocs = await WhatsappStatus.find({ disconnectRequested: { $ne: true } }).lean();
        for (const status of statusDocs) {
            const ownerId = String(status.ownerId);
            if (!activeClients.has(ownerId)) {
                startClient(ownerId);
            } else {
                await WhatsappStatus.findOneAndUpdate({ ownerId }, { lastPing: new Date() });
            }
        }

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
                const collectionName = 'whatsapp-RemoteAuth-' + ownerId;
                const collections = await mongoose.connection.db?.listCollections({ name: collectionName }).toArray();
                if (collections && collections.length > 0) {
                    await mongoose.connection.collection(collectionName).drop();
                }
            } catch (err) {
                console.error(`[Worker] Failed dropping RemoteAuth for ${ownerId}:`, err);
            }
            await WhatsappStatus.deleteOne({ ownerId });
            console.log(`[Worker] Disconnected ${ownerId}`);
        }
    } catch (error) {
        console.error("[Worker] Polling error:", error);
    }
}

// ─── Poll for outbound messages queued from the dashboard ────────────────────
async function pollPendingMessages() {
    try {
        const pending = await PendingMessage.find({ status: "pending" }).lean();
        for (const msg of pending) {
            const ownerId = String(msg.ownerId);
            const client = activeClients.get(ownerId);
            if (!client) continue;

            try {
                await client.sendMessage(msg.to, msg.text);
                await Conversation.findOneAndUpdate(
                    { ownerId, contactNumber: msg.to },
                    {
                        $push: { messages: { role: "owner", text: msg.text, timestamp: new Date() } },
                        $set: { lastMessageAt: new Date() },
                    },
                    { upsert: true }
                );
                await PendingMessage.findByIdAndUpdate(msg._id, { status: "sent" });
                console.log(`[Worker] Sent outbound to ${msg.to} for ${ownerId}`);
            } catch (err) {
                console.error(`[Worker] Failed sending to ${msg.to}:`, err);
                await PendingMessage.findByIdAndUpdate(msg._id, { status: "failed" });
            }
        }
    } catch (error) {
        console.error("[Worker] Pending message poll error:", error);
    }
}

// ─── Provider error helpers ───────────────────────────────────────────────────
async function reportProviderError(ownerId: string, provider: 'openai' | 'gemini' | 'grok' | 'groq', error: any) {
    let msg = "Unknown error";
    if (error?.status === 429) msg = "Quota exceeded or too many requests";
    else if (error?.status === 401) msg = "Invalid API key";
    else msg = error?.message || String(error);
    await WhatsappStatus.findOneAndUpdate(
        { ownerId },
        { $set: { [`providerStatus.${provider}`]: { error: msg, updatedAt: new Date() } } }
    ).catch(e => console.error("[Worker] Failed reporting error:", e));
}

async function clearProviderError(ownerId: string, provider: 'openai' | 'gemini' | 'grok' | 'groq') {
    await WhatsappStatus.findOneAndUpdate(
        { ownerId },
        { $unset: { [`providerStatus.${provider}`]: "" } }
    ).catch(() => {});
}

// ─── Deep reset a corrupted session ──────────────────────────────────────────
async function deepResetSession(ownerId: string) {
    console.warn(`[Worker] Deep resetting session for ${ownerId}...`);
    try {
        // Drop the RemoteAuth session collection from MongoDB
        const collectionName = 'whatsapp-RemoteAuth-' + ownerId;
        const collections = await mongoose.connection.db?.listCollections({ name: collectionName }).toArray();
        if (collections && collections.length > 0) {
            await mongoose.connection.collection(collectionName).drop();
            console.log(`[Worker] Dropped corrupted session for ${ownerId}`);
        }
        await WhatsappStatus.findOneAndUpdate({ ownerId }, {
            isReady: false,
            qrCode: null,
            $unset: { providerStatus: "" }
        });
    } catch (e) {
        console.error("[Worker] Reset failed:", e);
    }
}

// ─── Start a WhatsApp client for a given owner ───────────────────────────────
async function startClient(ownerId: string) {
    console.log(`[Worker] Initiating client for ${ownerId}`);

    const client = new Client({
        authStrategy: new RemoteAuth({
            clientId: ownerId,
            store: store,
            backupSyncIntervalMs: 300000,
        }),
        puppeteer: {
            headless: true,
            handleSIGINT: false,
            handleSIGTERM: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-extensions',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            ],
        },
    });

    // Register all event handlers BEFORE initialize()
    client.on('loading_screen', (percent, message) => {
        console.log(`[Worker] ${ownerId} loading: ${percent}% - ${message}`);
    });

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

    client.on('disconnected', (reason) => {
        console.log(`[Worker] ${ownerId} was logged out:`, reason);
        activeClients.delete(ownerId);
        WhatsappStatus.findOneAndUpdate({ ownerId }, { isReady: false, qrCode: null }).catch(() => {});
        // Auto-recovery: if it wasn't a manual disconnect, restart after 10s
        if (reason !== 'NAVIGATION') {
            console.log(`[Worker] Auto-recovering ${ownerId} in 10s...`);
            setTimeout(() => startClient(ownerId), 10000);
        }
    });

    // ─── Incoming message handler ─────────────────────────────────────────────
    client.on('message', async (msg) => {
        try {
            if (msg.fromMe || msg.isStatus) return;
            const chat = await msg.getChat();
            if (chat.isGroup) return;

            // Guard: only handle text messages
            if (msg.type !== 'chat') {
                await msg.reply(
                    "I'm an AI assistant and currently cannot process voice notes or images. Please type your question. "
                );
                return;
            }

            const contactNumber = msg.from;
            const contactName = chat.name || msg.from;

            // ── 1. Save incoming message ──────────────────────────────────
            await Conversation.findOneAndUpdate(
                { ownerId, contactNumber },
                {
                    $push: { messages: { role: "customer", text: msg.body, timestamp: new Date() } },
                    $set: { contactName, lastMessageAt: new Date() },
                    $setOnInsert: { ownerId, contactNumber },
                },
                { upsert: true, new: true }
            );

            // ── 2. Skip if AI is paused for this contact ──────────────────
            const convoCheck = await Conversation.findOne({ ownerId, contactNumber }).lean();
            if (convoCheck?.isAiPaused) {
                console.log(`[Worker] AI paused for ${contactNumber}, skipping.`);
                return;
            }

            // ── 3. Fetch settings (includes agentInstructions) ────────────
            const setting = await Settings.findOne({ ownerId }).lean();
            if (!setting) return;

            const KNOWLEDGE = `
            business name: ${setting.businessName || "not provided"}
            supportEmail: ${setting.supportEmail || "not provided"}
            knowledge: ${setting.knowledge || "not provided"}
            whatsappNumber: ${setting.whatsappNumber || "not provided"}
            `;

            const AGENT_INSTRUCTIONS = setting.agentInstructions
                ? `\nSPECIAL INSTRUCTIONS FROM THE BUSINESS OWNER (follow these strictly):\n${setting.agentInstructions}\n`
                : "";

            const prompt = `
You are a professional customer support assistant for this business chatting on WhatsApp.
Use ONLY the business information provided below. Keep answers concise and conversational.

LANGUAGE RULE: Always respond in the SAME language the customer is using. If they write in Hindi, you MUST respond in Hindi (Devanagari script). If they use Hinglish, you can use Hinglish. If they use English, stay in English.
${AGENT_INSTRUCTIONS}
IMPORTANT: Respond ONLY with valid JSON, no extra text:
{
  "canAnswer": true or false,
  "reply": "your answer here"
}

Set "canAnswer" to false if the question is not covered. Reply politely that the team will look into it.

BUSINESS INFORMATION:
${KNOWLEDGE}

CUSTOMER QUESTION:
${msg.body}

JSON RESPONSE:
`;

            let reply = "";
            let canAnswer = true;
            let aiSuccess = false;

            // ── Try OpenAI first ──────────────────────────────────────────
            const openaiKey = process.env.OPENAI_API_KEY;
            if (openaiKey && openaiKey !== "your_openai_api_key_here") {
                try {
                    const openai = new OpenAI({ apiKey: openaiKey });
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: 'user', content: prompt }],
                        response_format: { type: 'json_object' },
                    });
                    const content = completion.choices[0].message.content;
                    if (content) {
                        const parsed = JSON.parse(content);
                        canAnswer = parsed.canAnswer !== false;
                        reply = parsed.reply || "";
                        aiSuccess = true;
                        await clearProviderError(ownerId, 'openai');
                    }
                } catch (e: any) {
                    console.error(`[Worker] OpenAI failed:`, e);
                    await reportProviderError(ownerId, 'openai', e);
                }
            }


            // ── Fallback to Grok ──────────────────────────────────────────
            if (!aiSuccess) {
                const grokKey = process.env.GROK_API_KEY;
                if (grokKey) {
                    try {
                        const grok = new OpenAI({ apiKey: grokKey, baseURL: "https://api.x.ai/v1" });
                        const completion = await grok.chat.completions.create({
                            model: "grok-4",
                            messages: [{ role: 'user', content: prompt }],
                            response_format: { type: 'json_object' },
                        });
                        const content = completion.choices[0].message.content;
                        if (content) {
                            const parsed = JSON.parse(content);
                            canAnswer = parsed.canAnswer !== false;
                            reply = parsed.reply || "";
                            aiSuccess = true;
                            await clearProviderError(ownerId, 'grok');
                        }
                    } catch (e: any) {
                        console.error(`[Worker] Grok failed:`, e);
                        await reportProviderError(ownerId, 'grok', e);
                    }
                }
            }

            // ── Fallback to Groq ──────────────────────────────────────────
            if (!aiSuccess) {
                const groqKey = process.env.GROQ_API_KEY;
                if (groqKey) {
                    try {
                        const groq = new OpenAI({ apiKey: groqKey, baseURL: "https://api.groq.com/openai/v1" });
                        const completion = await groq.chat.completions.create({
                            model: "llama-3.3-70b-versatile",
                            messages: [{ role: 'user', content: prompt }],
                            response_format: { type: 'json_object' },
                        });
                        const content = completion.choices[0].message.content;
                        if (content) {
                            const parsed = JSON.parse(content);
                            canAnswer = parsed.canAnswer !== false;
                            reply = parsed.reply || "";
                            aiSuccess = true;
                            await clearProviderError(ownerId, 'groq');
                        }
                    } catch (e: any) {
                        console.error(`[Worker] Groq failed:`, e);
                        await reportProviderError(ownerId, 'groq', e);
                    }
                }
            }

            // ── Fallback to Gemini ────────────────────────────────────────
            if (!aiSuccess) {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
                const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
                for (const modelName of modelsToTry) {
                    try {
                        const geminiRes = await (ai as any).models.generateContent({
                            model: modelName,
                            contents: [{ role: 'user', parts: [{ text: prompt }] }],
                        });
                        if (geminiRes) {
                            let cleaned = (geminiRes.text || "").trim();
                            if (cleaned.startsWith("```")) {
                                cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
                            }
                            const parsed = JSON.parse(cleaned);
                            canAnswer = parsed.canAnswer !== false;
                            reply = parsed.reply || "";
                            aiSuccess = true;
                            await clearProviderError(ownerId, 'gemini');
                            break;
                        }
                    } catch (e: any) {
                        if (modelName === modelsToTry[modelsToTry.length - 1]) {
                            await reportProviderError(ownerId, 'gemini', e);
                        }
                        continue;
                    }
                }
            }

            if (!aiSuccess) {
                await msg.reply("Hi! Our support assistant is temporarily unavailable. Please try again shortly. ");
                return;
            }

            if (!canAnswer) {
                await UnansweredQuestion.create({
                    ownerId, question: msg.body, source: "whatsapp", status: "unanswered",
                }).catch(() => {});
            }

            if (reply) await msg.reply(reply);

            // ── 4. Save bot reply ─────────────────────────────────────────
            const updatedConvo = await Conversation.findOneAndUpdate(
                { ownerId, contactNumber },
                {
                    $push: { messages: { role: "bot", text: reply, timestamp: new Date() } },
                    $set: { lastMessageAt: new Date() },
                },
                { new: true }
            );

            // ── 5. Run full analysis (async, non-blocking) ────────────────
            if (updatedConvo) {
                analyzeConversation(updatedConvo.messages, ownerId)
                    .then(async (analysis) => {
                        if (!analysis) return;
                        await Conversation.findByIdAndUpdate(updatedConvo._id, {
                            $set: {
                                intent: analysis.intent,
                                urgency: analysis.urgency,
                                leadScore: analysis.leadScore,
                                extractedName: analysis.extractedName,
                                extractedBudget: analysis.extractedBudget,
                                summary: analysis.summary,
                                nextBestAction: analysis.nextBestAction,
                                nextBestActionType: analysis.nextBestActionType,
                                "enriched.company": analysis.enriched.company,
                                "enriched.location": analysis.enriched.location,
                                "enriched.email": analysis.enriched.email,
                                "enriched.language": analysis.enriched.language,
                                lastAnalyzedAt: new Date(),
                            },
                        });
                        console.log(`[Worker] Analysis done for ${contactNumber}: ${analysis.leadScore} / ${analysis.nextBestActionType}`);
                    })
                    .catch((e) => console.error("[Worker] Analysis failed:", e));
            }

        } catch (error) {
            console.error(`[Worker] Message error for ${ownerId}:`, error);
        }
    });

    // ─── Register client and initialize ──────────────────────────────────────
    activeClients.set(ownerId, client);

    try {
        await client.initialize();
    } catch (err) {
        console.error(`[Worker] Failed to initialize ${ownerId}:`, err);
        activeClients.delete(ownerId);
        try { await client.destroy(); } catch {}
        // Deep reset the corrupted session so next QR is clean
        await deepResetSession(ownerId);
        // Auto-retry after 15 seconds with a fresh start
        console.log(`[Worker] Will retry ${ownerId} in 15s...`);
        setTimeout(() => startClient(ownerId), 15000);
    }
}

// ─── Graceful shutdown ────────────────────────────────────────────────────────
const cleanup = async () => {
    console.log("[Worker] Shutting down...");
    for (const client of activeClients.values()) {
        try { await client.destroy(); } catch {}
    }
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));

initWorker().catch(e => console.error("Worker failed to start:", e));
