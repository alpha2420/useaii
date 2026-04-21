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
import { getCachedReply, setCachedReply } from './src/lib/responseCache';
import { preprocessMessage } from './src/lib/preprocessMessage';
import { getRelevantContext } from './src/lib/rag';

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

let isPollingPendingMessages = false;

// ─── Poll for outbound messages queued from the dashboard ────────────────────
async function pollPendingMessages() {
    if (isPollingPendingMessages) return;
    isPollingPendingMessages = true;
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
    } finally {
        isPollingPendingMessages = false;
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

            // ── 3b. Language Onboarding Flow ──────────────────────────────
            // Check if bot has already sent the language selection prompt
            // We detect this by looking at the bot's own messages
            if (!existingConvo?.preferredLanguage) {
                const hasAskedLanguage = existingConvo?.messages?.some(
                    (m: any) => m.role === 'bot' && m.text.includes('1️⃣ English')
                );

                if (!hasAskedLanguage) {
                    // Has NOT been asked yet -> Send the language selection prompt NOW
                    const welcomeMsg = `Welcome to *${setting.businessName || "us"}*! / नमस्ते! 🙌\n\nPlease select your preferred language to continue / कृपया जारी रखने के लिए अपनी पसंदीदा भाषा चुनें:\n\n1️⃣ English\n2️⃣ Hindi (हिंदी)\n3️⃣ Hinglish`;
                    await msg.reply(welcomeMsg);
                    await Conversation.findOneAndUpdate(
                        { ownerId, contactNumber },
                        { $push: { messages: { role: "bot", text: welcomeMsg, timestamp: new Date() } } }
                    );
                    console.log(`[Worker] Language prompt sent to ${contactNumber}`);
                    return; // Wait for their reply
                } else {
                    // HAS been asked -> Parse their reply
                    const textLower = msg.body.trim().toLowerCase();
                    let selectedLang: string | null = null;

                    if (textLower === "1" || textLower.includes("english")) selectedLang = "english";
                    else if (textLower === "2" || textLower.includes("hindi")) selectedLang = "hindi";
                    else if (textLower === "3" || textLower.includes("hinglish")) selectedLang = "hinglish";

                    if (selectedLang) {
                        // Valid selection -> Save and acknowledge
                        await Conversation.findOneAndUpdate(
                            { ownerId, contactNumber },
                            { $set: { preferredLanguage: selectedLang } }
                        );
                        existingConvo.preferredLanguage = selectedLang;

                        const ackMsg = selectedLang === "hindi"
                            ? "धन्यवाद! हम हिंदी में बातचीत जारी रखेंगे। मैं आपकी कैसे मदद कर सकता/सकती हूँ?"
                            : selectedLang === "hinglish"
                            ? "Done! Hum Hinglish mein baat karenge. 😊 Bolo, kya help chahiye?"
                            : "Great! We'll continue in English. 😊 How can I help you today?";

                        await msg.reply(ackMsg);
                        await Conversation.findOneAndUpdate(
                            { ownerId, contactNumber },
                            { $push: { messages: { role: "bot", text: ackMsg, timestamp: new Date() } } }
                        );
                        console.log(`[Worker] Language set to '${selectedLang}' for ${contactNumber}`);
                        return; // Done with onboarding — they can send their real question next

                    } else {
                        // Invalid reply -> Ask again
                        const retryMsg = `कृपया 1, 2, या 3 में से एक option चुनें / Please choose a valid option:\n\n1️⃣ English\n2️⃣ Hindi (हिंदी)\n3️⃣ Hinglish`;
                        await msg.reply(retryMsg);
                        await Conversation.findOneAndUpdate(
                            { ownerId, contactNumber },
                            { $push: { messages: { role: "bot", text: retryMsg, timestamp: new Date() } } }
                        );
                        return;
                    }
                }
            }

            // ── 4. Build Memory Context ───────────────────────────────────
            const memoryContext = await buildMemoryContext(existingConvo, ownerId);

            // ── 4b. Pre-process the raw customer message ──────────────────
            // Clean slang, emojis, filler words before sending to AI
            const cleanMessage = preprocessMessage(msg.body);
            console.log(`[Worker] Raw: "${msg.body}" → Clean: "${cleanMessage}"`);

            const mediaLinks = setting.mediaLinks || [];
            const MEDIA_LINKS_CONTEXT = mediaLinks.length > 0
                ? `\n\n--- MEDIA & PHOTO LINKS ---\n${mediaLinks.map((l: any) => `${l.name} -> ${l.url}`).join("\n")}`
                : "";

            // Truncate knowledge to 800 chars max to avoid large context
            const knowledgeTrimmed = (setting.knowledge || "not provided").slice(0, 800);

            // Fetch specific relevant context via Vector Search (RAG)
            const ragContext = await getRelevantContext(cleanMessage, ownerId);

            const KNOWLEDGE = `name:${setting.businessName || ""} | email:${setting.supportEmail || ""} | wa:${setting.whatsappNumber || ""} | info:${knowledgeTrimmed}\n\n${ragContext}${MEDIA_LINKS_CONTEXT}`;

            const AGENT_INSTRUCTIONS = setting.agentInstructions
                ? `\nSPECIAL INSTRUCTIONS FROM THE BUSINESS OWNER (follow strictly):\n${setting.agentInstructions}\n`
                : "";

            // Cache is disabled so bot uses latest KB
            // const cachedReply = await getCachedReply(ownerId, cleanMessage);
            // if (cachedReply) {
            //     await msg.reply(cachedReply);
            //     // Still save the message to conversation history
            //     await Conversation.findOneAndUpdate(
            //         { ownerId, contactNumber },
            //         {
            //             $push: { messages: { role: "bot", text: cachedReply, timestamp: new Date() } },
            //             $set: { lastMessageAt: new Date() },
            //         }
            //     );
            //     console.log(`[Worker] Cache hit for ${contactNumber} — no AI call made.`);
            //     return;
            // }

            const languageRule = existingConvo?.preferredLanguage === "hindi" 
                ? "STRICT LANGUAGE RULE: You MUST reply exclusively in Hindi using the Devanagari script." 
                : existingConvo?.preferredLanguage === "hinglish" 
                ? "STRICT LANGUAGE RULE: You MUST reply exclusively in Hinglish (Hindi written in the English alphabet, conversational)." 
                : "STRICT LANGUAGE RULE: You MUST reply exclusively in English.";

            // ── 6. Build prompt and call AI ───────────────────────────────
            const prompt = `You are a warm, highly empathetic, and conversational human support agent. Reply JSON: {"canAnswer":true/false,"reply":"answer"}
RULES:
1. Speak in a natural, polite, and friendly human voice. Match the customer's conversational tone.
2. Be EXTREMELY short and direct. Max 1 sentence (under 15 words) UNLESS providing requested details. NO polite filler phrases (e.g. "Absolutely!", "I can help with that"). Just get straight to the point. Use 1 organic emoji. 
3. NEVER send links, addresses, or pricing without being asked.
4. STRICT LINK RULE: If the customer asks for a specific link (e.g. "send photos of hostel", "where is the location"), you MUST identify the ONE relevant link from the INFO and send only that. NEVER send multiple links at once. If you find multiple matches, ask for clarification (e.g., "Which hostel would you like photos for?").
5. Answer ONLY the exact question asked and NOTHING else. Do not hallucinate links.
6. ${languageRule}
${AGENT_INSTRUCTIONS}${memoryContext}
INFO: ${KNOWLEDGE}
Q: ${cleanMessage}`;

            let reply = "";
            let canAnswer = true;
            let aiSuccess = false;

            // Try Gemini (Primary)
            const geminiKey = process.env.GEMINI_API_KEY;
            if (geminiKey) {
                const ai = new GoogleGenAI({ apiKey: geminiKey as string });
                const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
                for (const modelName of modelsToTry) {
                    try {
                        const geminiRes = await (ai as any).models.generateContent({
                            model: modelName,
                            contents: [{ role: 'user', parts: [{ text: prompt }] }],
                            generationConfig: { maxOutputTokens: 120 }
                        });
                        if (geminiRes) {
                            let cleaned = (geminiRes.text || "").trim();
                            if (cleaned.startsWith("```")) {
                                cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
                            }
                            const parsed = JSON.parse(cleaned);
                            canAnswer = parsed.canAnswer !== false;
                            reply = parsed.reply || "";
                            const usage = (geminiRes as any).usageMetadata;
                            console.log(`[Worker] Gemini success | Tokens: In=${usage?.promptTokenCount}, Out=${usage?.candidatesTokenCount}, Total=${usage?.totalTokenCount}`);
                            aiSuccess = true;
                            break;
                        }
                    } catch { continue; }
                }
            }

            // Fallback OpenAI
            const openaiKey = process.env.OPENAI_API_KEY;
            if (!aiSuccess && openaiKey && openaiKey !== "your_openai_api_key_here") {
                try {
                    const openai = new OpenAI({ apiKey: openaiKey });
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: 'user', content: prompt }],
                        response_format: { type: 'json_object' },
                        max_tokens: 120,
                    });
                    const content = completion.choices[0].message.content;
                    if (content) {
                        const parsed = JSON.parse(content);
                        canAnswer = parsed.canAnswer !== false;
                        reply = parsed.reply || "";
                        aiSuccess = true;
                        const usage = completion.usage;
                        console.log(`[Worker] OpenAI success | Tokens: In=${usage?.prompt_tokens}, Out=${usage?.completion_tokens}, Total=${usage?.total_tokens}`);
                    }
                } catch (e) { console.error(`[Worker] OpenAI failed:`, e); }
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

            if (reply) {
                await msg.reply(reply);
                // Cache disabled
                // if (canAnswer) {
                //     setCachedReply(ownerId, msg.body, reply).catch(() => {});
                // }
            }

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
            const msgCount = updatedConvo?.messages?.length || 0;
            if (updatedConvo && (msgCount <= 1 || msgCount % 5 === 0)) {
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
