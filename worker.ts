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
import { buildMemoryContext } from './src/lib/buildMemoryContext';

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
            args: [
                '--no-sandbox', '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas',
                '--no-first-run', '--no-zygote', '--disable-gpu',
            ],
        },
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

    // ─── Incoming message handler ─────────────────────────────────────────
    client.on('message', async (msg) => {
        try {
            if (msg.fromMe || msg.isStatus) return;
            const chat = await msg.getChat();
            if (chat.isGroup) return;

            // Guard: text only
            if (msg.type !== 'chat') {
                await msg.reply(
                    "I'm an AI assistant and currently cannot process voice notes or images. Please type your question. 🙏"
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

            // ── 2. Check if AI is paused ──────────────────────────────────
            const existingConvo = await Conversation.findOne({ ownerId, contactNumber });
            if (existingConvo?.isAiPaused) {
                console.log(`[Worker] AI paused for ${contactNumber}, skipping.`);
                return;
            }

            // ── 3. Fetch settings ─────────────────────────────────────────
            const setting = await Settings.findOne({ ownerId }).lean();
            if (!setting) return;

            // ── 4. Build Memory Context ───────────────────────────────────
            // This is the "AI Memory" feature — the AI knows who it's talking to
            const memoryContext = await buildMemoryContext(existingConvo, ownerId);

            const mediaLinks = setting.mediaLinks || [];
            const MEDIA_LINKS_CONTEXT = mediaLinks.length > 0
                ? `\n\n--- MEDIA & PHOTO LINKS ---\n${mediaLinks.map((l: any) => `${l.name} -> ${l.url}`).join("\n")}\nIMPORTANT RULE: If a customer asks to see a photo, product, or link that matches an item above, you MUST include its exact URL naturally in your reply. Do not invent links.`
                : "";

            const KNOWLEDGE = `
            business name- ${setting.businessName || "not provided"}
            supportEmail- ${setting.supportEmail || "not provided"}
            knowledge- ${setting.knowledge || "not provided"}
            whatsappNumber- ${setting.whatsappNumber || "not provided"}${MEDIA_LINKS_CONTEXT}
            `;

            const AGENT_INSTRUCTIONS = setting.agentInstructions
                ? `\nSPECIAL INSTRUCTIONS FROM THE BUSINESS OWNER (follow strictly):\n${setting.agentInstructions}\n`
                : "";

            // ── 5. Build prompt with memory injected ──────────────────────
            const prompt = `
You are a professional customer support assistant chatting on WhatsApp.
Use ONLY the business information and memory provided below.
Keep answers concise and conversational, suited for WhatsApp.
${AGENT_INSTRUCTIONS}
${memoryContext}

IMPORTANT: Respond ONLY with valid JSON, no extra text:
{
  "canAnswer": true or false,
  "reply": "your answer here"
}

Set "canAnswer" to false only if the question is completely outside the business information.

BUSINESS INFORMATION:
${KNOWLEDGE}

CUSTOMER'S CURRENT MESSAGE:
${msg.body}

JSON RESPONSE:
`;

            let reply = "";
            let canAnswer = true;
            let aiSuccess = false;

            // Try OpenAI
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
                        console.log(`[Worker] OpenAI success for ${ownerId} (with memory)`);
                    }
                } catch (e) { console.error(`[Worker] OpenAI failed:`, e); }
            }

            // Fallback Gemini
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
                            break;
                        }
                    } catch { continue; }
                }
            }

            if (!aiSuccess) {
                await msg.reply("Hi! Our support assistant is temporarily unavailable. Please try again shortly. 🙏");
                return;
            }

            if (!canAnswer) {
                await UnansweredQuestion.create({
                    ownerId, question: msg.body, source: "whatsapp", status: "unanswered",
                }).catch(() => {});
            }

            if (reply) await msg.reply(reply);

            // ── 6. Save bot reply ─────────────────────────────────────────
            const updatedConvo = await Conversation.findOneAndUpdate(
                { ownerId, contactNumber },
                {
                    $push: { messages: { role: "bot", text: reply, timestamp: new Date() } },
                    $set: { lastMessageAt: new Date() },
                },
                { new: true }
            );

            // ── 7. Run analysis async (intent, lead score, next action, enriched) ──
            if (updatedConvo) {
                analyzeConversation(updatedConvo.messages)
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
                        console.log(`[Worker] Analysis + memory done for ${contactNumber}`);
                    })
                    .catch((e) => console.error("[Worker] Analysis failed:", e));
            }

        } catch (error) {
            console.error(`[Worker] Message error for ${ownerId}:`, error);
        }
    });

    try {
        await client.initialize();
    } catch (err) {
        console.error(`[Worker] Init failed for ${ownerId}:`, err);
        activeClients.delete(ownerId);
        try { await client.destroy(); } catch {}
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
