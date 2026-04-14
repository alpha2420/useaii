"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type CRMStage = "new" | "contacted" | "interested" | "negotiating" | "won" | "lost";

interface IMessage {
    role: "customer" | "bot" | "owner";
    text: string;
    timestamp: string;
}

interface Contact {
    _id: string;
    contactNumber: string;
    contactName: string;
    leadScore: "hot" | "warm" | "cold";
    stage: CRMStage;
    notes: string;
    isAiPaused: boolean;
    extractedName: string | null;
    extractedBudget: string | null;
    summary: string | null;
    enriched?: {
        company: string | null;
        location: string | null;
        language: string | null;
        email: string | null;
    };
    messages: IMessage[];
    lastMessageAt: string;
}

const STAGES: CRMStage[] = ["new", "contacted", "interested", "negotiating", "won", "lost"];

const MSG_STYLES = {
    customer: "bg-white text-zinc-800 self-start rounded-2xl rounded-tl-sm border border-zinc-200 shadow-sm",
    bot: "bg-indigo-50 text-indigo-900 self-end rounded-2xl rounded-tr-sm border border-indigo-200",
    owner: "bg-emerald-50 text-emerald-900 self-end rounded-2xl rounded-tr-sm border border-emerald-200",
};

const MSG_LABEL: Record<string, string> = {
    customer: "Customer",
    bot: "AI Bot",
    owner: "You",
};

// ── Correction Modal ──────────────────────────────────────────────────────────
function CorrectionModal({
    question,
    badReply,
    onSave,
    onClose,
}: {
    question: string;
    badReply: string;
    onSave: (correctReply: string) => void;
    onClose: () => void;
}) {
    const [correctReply, setCorrectReply] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!correctReply.trim()) return;
        setSaving(true);
        await onSave(correctReply.trim());
        setSaving(false);
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white border border-zinc-200 shadow-2xl rounded-2xl p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-zinc-900 mb-1">Correct this reply</h3>
                <p className="text-xs text-zinc-500 mb-5">
                    The AI will remember this correction and never make the same mistake again.
                </p>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Customer asked</p>
                    <p className="text-sm text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl p-3">{question}</p>
                </div>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">❌ AI said (wrong)</p>
                    <p className="text-sm text-red-900 bg-red-50 border border-red-200 rounded-xl p-3 line-through">{badReply}</p>
                </div>

                <div className="mb-5">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">✅ Correct answer</p>
                    <textarea
                        value={correctReply}
                        onChange={(e) => setCorrectReply(e.target.value)}
                        placeholder="Type what the AI should have said..."
                        rows={4}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving || !correctReply.trim()}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black disabled:opacity-40 transition-all"
                        style={{ background: "linear-gradient(135deg, #6ee7b7, #34d399)" }}
                    >
                        {saving ? "Saving..." : "Save & Teach AI"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Chat Page ───────────────────────────────────────────────────────────
export default function CRMChatPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contactNumber = searchParams.get("contact") || "";

    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [notes, setNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [togglingAi, setTogglingAi] = useState(false);

    // Correction modal state
    const [correctionTarget, setCorrectionTarget] = useState<{
        question: string;
        badReply: string;
        msgIndex: number;
    } | null>(null);
    const [correctionSuccess, setCorrectionSuccess] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contactNumber) fetchConversation();
    }, [contactNumber]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [contact?.messages]);

    async function fetchConversation() {
        setLoading(true);
        try {
            const res = await fetch(`/api/crm?contactNumber=${encodeURIComponent(contactNumber)}`);
            const data: Contact = await res.json();
            setContact(data);
            setNotes(data.notes || "");
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function sendMessage() {
        if (!message.trim() || sending) return;
        setSending(true);
        try {
            await fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactNumber, text: message.trim() }),
            });
            setContact((prev) =>
                prev ? {
                    ...prev,
                    messages: [...prev.messages, { role: "owner", text: message.trim(), timestamp: new Date().toISOString() }],
                } : prev
            );
            setMessage("");
        } catch (e) { console.error(e); }
        finally { setSending(false); }
    }

    async function saveNotes() {
        setSavingNotes(true);
        try {
            await fetch("/api/crm", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactNumber, notes }),
            });
        } finally { setSavingNotes(false); }
    }

    async function toggleAi() {
        if (!contact) return;
        setTogglingAi(true);
        try {
            const res = await fetch("/api/crm", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactNumber, isAiPaused: !contact.isAiPaused }),
            });
            const updated = await res.json();
            setContact((prev) => prev ? { ...prev, isAiPaused: updated.isAiPaused } : prev);
        } finally { setTogglingAi(false); }
    }

    async function updateStage(stage: CRMStage) {
        await fetch("/api/crm", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactNumber, stage }),
        });
        setContact((prev) => prev ? { ...prev, stage } : prev);
    }

    // Find the customer message that came just before a bot message
    function findQuestionForBotMessage(messages: IMessage[], botIndex: number): string {
        for (let i = botIndex - 1; i >= 0; i--) {
            if (messages[i].role === "customer") return messages[i].text;
        }
        return "Unknown question";
    }

    async function handleSaveCorrection(correctReply: string) {
        if (!correctionTarget) return;
        try {
            await fetch("/api/corrections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contactNumber,
                    originalQuestion: correctionTarget.question,
                    badReply: correctionTarget.badReply,
                    correctReply,
                }),
            });
            setCorrectionTarget(null);
            setCorrectionSuccess(true);
            setTimeout(() => setCorrectionSuccess(false), 3000);
        } catch (e) { console.error(e); }
    }

    function formatTime(iso: string) {
        return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function formatDate(iso: string) {
        return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
    }

    const displayName = (c: Contact) =>
        c.extractedName || c.contactName || c.contactNumber.replace("@c.us", "");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-emerald-200 rounded-full animate-spin" />
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <p className="text-zinc-500">Contact not found.</p>
            </div>
        );
    }

    // Group messages by date
    const groupedMessages: { date: string; messages: { msg: IMessage; originalIndex: number }[] }[] = [];
    contact.messages.forEach((msg, idx) => {
        const date = formatDate(msg.timestamp);
        const last = groupedMessages[groupedMessages.length - 1];
        if (last && last.date === date) {
            last.messages.push({ msg, originalIndex: idx });
        } else {
            groupedMessages.push({ date, messages: [{ msg, originalIndex: idx }] });
        }
    });

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">

            {/* Correction success toast */}
            {correctionSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg">
                    ✓ AI correction saved — it will learn from this immediately
                </div>
            )}

            {/* Correction modal */}
            {correctionTarget && (
                <CorrectionModal
                    question={correctionTarget.question}
                    badReply={correctionTarget.badReply}
                    onSave={handleSaveCorrection}
                    onClose={() => setCorrectionTarget(null)}
                />
            )}

            {/* ── Top Bar ── */}
            <div className="border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/dashboard/crm")}
                        className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="w-px h-5 bg-zinc-200" />
                    <div>
                        <p className="font-semibold text-zinc-900">{displayName(contact)}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-zinc-500">{contact.contactNumber.replace("@c.us", "")}</p>
                            {contact.enriched?.location && (
                                <span className="text-xs text-zinc-500">· 📍 {contact.enriched.location}</span>
                            )}
                            {contact.enriched?.language && (
                                <span className="text-xs text-zinc-500">· 🌐 {contact.enriched.language}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={contact.stage}
                        onChange={(e) => updateStage(e.target.value as CRMStage)}
                        className="text-xs border border-zinc-300 rounded-lg px-2 py-1.5 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 capitalize shadow-sm"
                    >
                        {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                        onClick={toggleAi}
                        disabled={togglingAi}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            contact.isAiPaused
                                ? "bg-orange-50 text-orange-600 border-orange-200"
                                : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}
                    >
                        {contact.isAiPaused ? "▶ Resume AI" : "⏸ Pause AI"}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full">
                {/* ── Chat Thread ── */}
                <div className="flex-1 flex flex-col border-r border-zinc-200 bg-zinc-50/50">
                    {contact.isAiPaused && (
                        <div className="bg-orange-50 border-b border-orange-200 px-6 py-2 text-xs text-orange-600 text-center font-medium">
                            ⏸ AI auto-reply paused — you are in manual control
                        </div>
                    )}

                    {/* Memory banner — show if we know things about this contact */}
                    {(contact.extractedName || contact.enriched?.location || contact.extractedBudget) && (
                        <div className="bg-indigo-50 border-b border-indigo-200 px-6 py-2 text-xs text-indigo-700 flex items-center gap-4">
                            <span className="font-semibold">🧠 AI Memory:</span>
                            {contact.extractedName && <span>Name: {contact.extractedName}</span>}
                            {contact.enriched?.location && <span>Location: {contact.enriched.location}</span>}
                            {contact.extractedBudget && <span>Budget: {contact.extractedBudget}</span>}
                            {contact.enriched?.language && <span>Language: {contact.enriched.language}</span>}
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                        {groupedMessages.length === 0 ? (
                            <div className="text-center text-zinc-400 mt-20 text-sm">No messages yet</div>
                        ) : (
                            groupedMessages.map(({ date, messages }) => (
                                <div key={date}>
                                    <div className="text-center text-xs font-medium text-zinc-400 mb-4">{date}</div>
                                    <div className="flex flex-col gap-3">
                                        {messages.map(({ msg, originalIndex }) => (
                                            <div
                                                key={originalIndex}
                                                className={`flex flex-col max-w-sm group ${
                                                    msg.role !== "customer" ? "self-end items-end" : "self-start items-start"
                                                }`}
                                            >
                                                <span className="text-xs text-zinc-400 mb-1 px-1">
                                                    {MSG_LABEL[msg.role]}
                                                </span>
                                                <div className={`px-4 py-2.5 text-sm ${MSG_STYLES[msg.role]}`}>
                                                    {msg.text}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 px-1">
                                                    <span className="text-xs text-zinc-400">{formatTime(msg.timestamp)}</span>
                                                    {/* Correct button — only on bot messages */}
                                                    {msg.role === "bot" && (
                                                        <button
                                                            onClick={() => setCorrectionTarget({
                                                                question: findQuestionForBotMessage(contact.messages, originalIndex),
                                                                badReply: msg.text,
                                                                msgIndex: originalIndex,
                                                            })}
                                                            className="text-xs text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            ✏️ Correct this
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Send Box */}
                    <div className="border-t border-zinc-200 bg-white px-6 py-4">
                        <div className="flex gap-3 items-end">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                                }}
                                placeholder="Type a message to send via WhatsApp..."
                                rows={2}
                                className="flex-1 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm bg-white text-zinc-900 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-400 shadow-sm"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={sending || !message.trim()}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-sm"
                            >
                                {sending ? "..." : "Send"}
                            </button>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
                    </div>
                </div>

                {/* ── Right Sidebar ── */}
                <div className="w-72 bg-white/50 p-5 space-y-5 overflow-y-auto">
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Contact Intel</p>
                        <div className="space-y-2 text-sm">
                            {[
                                { label: "Lead", value: contact.leadScore },
                                { label: "Budget", value: contact.extractedBudget },
                                { label: "Company", value: contact.enriched?.company },
                                { label: "Email", value: contact.enriched?.email },
                            ].filter((r) => r.value).map((r) => (
                                <div key={r.label} className="flex justify-between">
                                    <span className="text-zinc-500 text-xs">{r.label}</span>
                                    <span className="text-zinc-900 text-xs font-medium">{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {contact.summary && (
                        <div>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">AI Summary</p>
                            <p className="text-xs text-zinc-600 bg-zinc-100 rounded-xl p-3 leading-relaxed border border-zinc-200">{contact.summary}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Private Notes</p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add private notes..."
                            rows={4}
                            className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs bg-white text-zinc-900 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-400 shadow-sm"
                        />
                        <button
                            onClick={saveNotes}
                            disabled={savingNotes}
                            className="mt-2 w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium py-2 rounded-lg transition-all"
                        >
                            {savingNotes ? "Saving..." : "Save Notes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
