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
    messages: IMessage[];
    lastMessageAt: string;
}

const STAGES: CRMStage[] = ["new", "contacted", "interested", "negotiating", "won", "lost"];

const MSG_STYLES = {
    customer: "bg-white border border-gray-200 text-gray-800 self-start rounded-2xl rounded-tl-sm",
    bot: "bg-indigo-50 border border-indigo-100 text-indigo-900 self-end rounded-2xl rounded-tr-sm",
    owner: "bg-gray-900 text-white self-end rounded-2xl rounded-tr-sm",
};

const MSG_LABEL = {
    customer: "Customer",
    bot: "AI Bot",
    owner: "You",
};

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
            // Optimistically add to UI
            setContact((prev) =>
                prev
                    ? {
                        ...prev,
                        messages: [
                            ...prev.messages,
                            { role: "owner", text: message.trim(), timestamp: new Date().toISOString() },
                        ],
                    }
                    : prev
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

    function formatTime(iso: string) {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function formatDate(iso: string) {
        return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
    }

    const displayName = (c: Contact) =>
        c.extractedName || c.contactName || c.contactNumber.replace("@c.us", "");

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400">Loading conversation...</p>
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400">Contact not found.</p>
            </div>
        );
    }

    // Group messages by date
    const groupedMessages: { date: string; messages: IMessage[] }[] = [];
    for (const msg of contact.messages) {
        const date = formatDate(msg.timestamp);
        const last = groupedMessages[groupedMessages.length - 1];
        if (last && last.date === date) {
            last.messages.push(msg);
        } else {
            groupedMessages.push({ date, messages: [msg] });
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/dashboard/crm")}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                        ← Back
                    </button>
                    <div className="w-px h-5 bg-gray-200" />
                    <div>
                        <p className="font-semibold text-gray-900">{displayName(contact)}</p>
                        <p className="text-xs text-gray-400">{contact.contactNumber.replace("@c.us", "")}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Stage selector */}
                    <select
                        value={contact.stage}
                        onChange={(e) => updateStage(e.target.value as CRMStage)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none capitalize"
                    >
                        {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {/* AI Toggle */}
                    <button
                        onClick={toggleAi}
                        disabled={togglingAi}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            contact.isAiPaused
                                ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                                : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                        }`}
                    >
                        {contact.isAiPaused ? "▶ Resume AI" : "⏸ Pause AI"}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full gap-0">
                {/* ── Chat Thread ── */}
                <div className="flex-1 flex flex-col">
                    {/* AI paused banner */}
                    {contact.isAiPaused && (
                        <div className="bg-orange-50 border-b border-orange-200 px-6 py-2 text-xs text-orange-700 text-center font-medium">
                            ⏸ AI auto-reply is paused — you are in manual control
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                        {groupedMessages.length === 0 ? (
                            <div className="text-center text-gray-300 mt-20 text-sm">No messages yet</div>
                        ) : (
                            groupedMessages.map(({ date, messages }) => (
                                <div key={date}>
                                    <div className="text-center text-xs text-gray-400 mb-4">{date}</div>
                                    <div className="flex flex-col gap-2">
                                        {messages.map((msg, i) => (
                                            <div key={i} className={`flex flex-col max-w-sm ${msg.role !== "customer" ? "self-end items-end" : "self-start items-start"}`}>
                                                <span className="text-xs text-gray-400 mb-0.5 px-1">{MSG_LABEL[msg.role]}</span>
                                                <div className={`px-4 py-2.5 text-sm ${MSG_STYLES[msg.role]}`}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-xs text-gray-300 mt-0.5 px-1">{formatTime(msg.timestamp)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Send Box */}
                    <div className="bg-white border-t border-gray-200 px-6 py-4">
                        <div className="flex gap-3 items-end">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                placeholder="Type a message to send via WhatsApp..."
                                rows={2}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={sending || !message.trim()}
                                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {sending ? "Sending..." : "Send"}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            Message sends via WhatsApp · Enter to send · Shift+Enter for new line
                        </p>
                    </div>
                </div>

                {/* ── Right Sidebar ── */}
                <div className="w-72 bg-white border-l border-gray-200 p-5 space-y-5 overflow-y-auto">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Info</p>
                        <div className="space-y-2 text-sm">
                            <Row label="Lead Score">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    contact.leadScore === "hot" ? "bg-red-100 text-red-700" :
                                    contact.leadScore === "warm" ? "bg-orange-100 text-orange-600" :
                                    "bg-blue-100 text-blue-600"
                                }`}>
                                    {contact.leadScore}
                                </span>
                            </Row>
                            {contact.extractedBudget && (
                                <Row label="Budget">{contact.extractedBudget}</Row>
                            )}
                        </div>
                    </div>

                    {contact.summary && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">AI Summary</p>
                            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{contact.summary}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add private notes about this contact..."
                            rows={5}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        <button
                            onClick={saveNotes}
                            disabled={savingNotes}
                            className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 rounded-lg transition-all disabled:opacity-50"
                        >
                            {savingNotes ? "Saving..." : "Save Notes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">{label}</span>
            <span className="text-gray-800 text-xs">{children}</span>
        </div>
    );
}
