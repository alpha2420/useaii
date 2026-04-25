"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type CRMStage = "new" | "contacted" | "interested" | "negotiating" | "won" | "lost";
type LeadScore = "hot" | "warm" | "cold";

interface IMessage {
    role: "customer" | "bot" | "owner";
    text: string;
    timestamp: string;
}

interface Contact {
    _id: string;
    contactNumber: string;
    contactName: string;
    leadScore: LeadScore;
    stage: CRMStage;
    notes: string;
    isAiPaused: boolean;
    extractedName: string | null;
    extractedBudget: string | null;
    summary: string | null;
    enriched?: { company: string | null; location: string | null; language: string | null; email: string | null; };
    messages: IMessage[];
    lastMessageAt: string;
}

interface ContactListItem {
    _id: string;
    contactNumber: string;
    contactName: string;
    leadScore: LeadScore;
    stage: CRMStage;
    isAiPaused: boolean;
    extractedName: string | null;
    summary: string | null;
    lastMessageAt: string;
}

const STAGES: CRMStage[] = ["new", "contacted", "interested", "negotiating", "won", "lost"];

const LEAD_DOT: Record<LeadScore, string> = {
    hot: "bg-red-500",
    warm: "bg-amber-400",
    cold: "bg-sky-400",
};

const LEAD_BADGE: Record<LeadScore, string> = {
    hot: "bg-red-50 text-red-700 border border-red-200",
    warm: "bg-amber-50 text-amber-700 border border-amber-200",
    cold: "bg-sky-50 text-sky-700 border border-sky-200",
};

function displayName(c: { extractedName?: string | null; contactName?: string; contactNumber: string }) {
    return c.extractedName || c.contactName || c.contactNumber.replace("@c.us", "");
}

function formatTime(iso: string) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatMsgTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

// ── Correction Modal ──────────────────────────────────────────────────────────
function CorrectionModal({ question, badReply, onSave, onClose }: {
    question: string; badReply: string;
    onSave: (r: string) => void; onClose: () => void;
}) {
    const [val, setVal] = useState("");
    const [saving, setSaving] = useState(false);
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-base font-bold text-zinc-900 mb-1">Correct this reply</h3>
                <p className="text-xs text-zinc-400 mb-5">The AI will remember this and never make this mistake again.</p>
                <div className="mb-4">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Customer asked</p>
                    <p className="text-sm text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl p-3">{question}</p>
                </div>
                <div className="mb-4">
                    <p className="text-[10px] font-semibold text-red-500 uppercase tracking-widest mb-1">❌ AI said (wrong)</p>
                    <p className="text-sm text-red-900 bg-red-50 border border-red-200 rounded-xl p-3 line-through opacity-70">{badReply}</p>
                </div>
                <div className="mb-5">
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mb-1">✅ Correct answer</p>
                    <textarea value={val} onChange={e => setVal(e.target.value)} placeholder="Type the correct response..." rows={3}
                        className="w-full border border-zinc-300 rounded-xl px-3 py-2.5 text-sm text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400/50" autoFocus />
                </div>
                <div className="flex gap-2">
                    <button onClick={async () => { if (!val.trim()) return; setSaving(true); await onSave(val.trim()); setSaving(false); }}
                        disabled={saving || !val.trim()}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 transition-all">
                        {saving ? "Saving..." : "Save & Teach AI"}
                    </button>
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-zinc-600 border border-zinc-200 hover:bg-zinc-50 transition-all">Cancel</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CRMChatPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeContact = searchParams.get("contact") || "";

    const [contacts, setContacts] = useState<ContactListItem[]>([]);
    const [contact, setContact] = useState<Contact | null>(null);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [notes, setNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [togglingAi, setTogglingAi] = useState(false);
    const [search, setSearch] = useState("");
    const [correctionTarget, setCorrectionTarget] = useState<{ question: string; badReply: string; msgIndex: number } | null>(null);
    const [correctionSuccess, setCorrectionSuccess] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Fetch contact list
    useEffect(() => {
        fetch("/api/crm")
            .then(r => r.json())
            .then(d => setContacts(d.contacts || []))
            .catch(console.error)
            .finally(() => setLoadingList(false));
    }, []);

    // Auto-refresh list every 15s
    useEffect(() => {
        const t = setInterval(() => {
            fetch("/api/crm").then(r => r.json()).then(d => setContacts(d.contacts || [])).catch(() => {});
        }, 15000);
        return () => clearInterval(t);
    }, []);

    // Fetch single conversation
    const fetchConversation = useCallback(async (num: string) => {
        setLoadingChat(true);
        try {
            const res = await fetch(`/api/crm?contactNumber=${encodeURIComponent(num)}`);
            const data: Contact = await res.json();
            setContact(data);
            setNotes(data.notes || "");
        } catch (e) { console.error(e); }
        finally { setLoadingChat(false); }
    }, []);

    useEffect(() => {
        if (activeContact) fetchConversation(activeContact);
    }, [activeContact, fetchConversation]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [contact?.messages]);

    async function sendMessage() {
        if (!message.trim() || sending || !activeContact) return;
        setSending(true);
        try {
            await fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactNumber: activeContact, text: message.trim() }),
            });
            setContact(prev => prev ? {
                ...prev,
                messages: [...prev.messages, { role: "owner", text: message.trim(), timestamp: new Date().toISOString() }],
            } : prev);
            setMessage("");
        } finally { setSending(false); }
    }

    async function saveNotes() {
        setSavingNotes(true);
        try {
            await fetch("/api/crm", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactNumber: activeContact, notes }),
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
                body: JSON.stringify({ contactNumber: activeContact, isAiPaused: !contact.isAiPaused }),
            });
            const updated = await res.json();
            setContact(prev => prev ? { ...prev, isAiPaused: updated.isAiPaused } : prev);
            setContacts(prev => prev.map(c => c.contactNumber === activeContact ? { ...c, isAiPaused: updated.isAiPaused } : c));
        } finally { setTogglingAi(false); }
    }

    async function updateStage(stage: CRMStage) {
        await fetch("/api/crm", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactNumber: activeContact, stage }),
        });
        setContact(prev => prev ? { ...prev, stage } : prev);
    }

    async function handleSaveCorrection(correctReply: string) {
        if (!correctionTarget) return;
        await fetch("/api/corrections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactNumber: activeContact, originalQuestion: correctionTarget.question, badReply: correctionTarget.badReply, correctReply }),
        });
        setCorrectionTarget(null);
        setCorrectionSuccess(true);
        setTimeout(() => setCorrectionSuccess(false), 3000);
    }

    function findQuestion(msgs: IMessage[], botIdx: number) {
        for (let i = botIdx - 1; i >= 0; i--) {
            if (msgs[i].role === "customer") return msgs[i].text;
        }
        return "Unknown question";
    }

    const filtered = contacts.filter(c => {
        if (!search) return true;
        const q = search.toLowerCase();
        return displayName(c).toLowerCase().includes(q) || c.contactNumber.includes(q);
    });

    // Group messages by date
    const grouped: { date: string; msgs: { msg: IMessage; idx: number }[] }[] = [];
    (contact?.messages || []).forEach((msg, idx) => {
        const date = formatDate(msg.timestamp);
        const last = grouped[grouped.length - 1];
        if (last && last.date === date) last.msgs.push({ msg, idx });
        else grouped.push({ date, msgs: [{ msg, idx }] });
    });

    const MSG_STYLE: Record<string, string> = {
        customer: "bg-white border border-zinc-200 text-zinc-800 self-start rounded-2xl rounded-tl-sm shadow-sm",
        bot: "bg-indigo-50 border border-indigo-100 text-indigo-900 self-end rounded-2xl rounded-tr-sm",
        owner: "bg-emerald-500 text-white self-end rounded-2xl rounded-tr-sm shadow-md",
    };

    return (
        <div className="h-screen flex flex-col bg-zinc-100 overflow-hidden">
            {/* Toast */}
            {correctionSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-pulse">
                    ✓ AI correction saved!
                </div>
            )}
            {correctionTarget && (
                <CorrectionModal question={correctionTarget.question} badReply={correctionTarget.badReply}
                    onSave={handleSaveCorrection} onClose={() => setCorrectionTarget(null)} />
            )}

            {/* Top bar */}
            <div className="bg-white border-b border-zinc-200 px-4 h-14 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/dashboard/crm")} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-sm font-medium transition-colors">
                        <span>←</span> <span>Back</span>
                    </button>
                    <div className="w-px h-5 bg-zinc-200" />
                    {contact ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                {displayName(contact).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 leading-tight">{displayName(contact)}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-zinc-400">{contact.contactNumber.replace("@c.us", "")}</p>
                                    {contact.enriched?.language && <span className="text-xs text-zinc-400">· 🌐 {contact.enriched.language}</span>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-400">Select a conversation</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {contact && (
                        <>
                            <select value={contact.stage} onChange={e => updateStage(e.target.value as CRMStage)}
                                className="text-xs border border-zinc-200 rounded-lg px-2 py-1.5 bg-zinc-50 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 capitalize cursor-pointer">
                                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button onClick={toggleAi} disabled={togglingAi}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                    contact.isAiPaused
                                        ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                }`}>
                                {contact.isAiPaused ? "▶ Resume AI" : "⏸ Pause AI"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 3-column body */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── LEFT: Contact List ── */}
                <div className="w-80 bg-white border-r border-zinc-200 flex flex-col flex-shrink-0">
                    <div className="p-3 border-b border-zinc-100">
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search contacts..."
                            className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition placeholder:text-zinc-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loadingList ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center text-zinc-400 text-xs py-12">No contacts found</div>
                        ) : (
                            filtered.map(c => {
                                const isActive = c.contactNumber === activeContact;
                                return (
                                    <button key={c._id}
                                        onClick={() => router.push(`/dashboard/crm/chat?contact=${encodeURIComponent(c.contactNumber)}`)}
                                        className={`w-full text-left px-4 py-3.5 border-b border-zinc-100 transition-all flex items-start gap-3 ${isActive ? "bg-indigo-50 border-l-2 border-l-indigo-500" : "hover:bg-zinc-50"}`}>
                                        <div className="relative flex-shrink-0 mt-0.5">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-center justify-center text-white text-sm font-bold">
                                                {displayName(c).charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${LEAD_DOT[c.leadScore]}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={`text-sm font-medium truncate ${isActive ? "text-indigo-700" : "text-zinc-900"}`}>
                                                    {displayName(c)}
                                                </p>
                                                <span className="text-[10px] text-zinc-400 flex-shrink-0 ml-2">{formatTime(c.lastMessageAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${LEAD_BADGE[c.leadScore]}`}>{c.leadScore}</span>
                                                {c.isAiPaused && <span className="text-[10px] bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded font-medium">Manual</span>}
                                            </div>
                                            {c.summary && <p className="text-[11px] text-zinc-400 truncate mt-0.5 leading-snug">{c.summary}</p>}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── CENTER: Chat Thread ── */}
                <div className="flex-1 flex flex-col min-w-0"
                    style={{ backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", backgroundSize: "20px 20px", backgroundColor: "#f3f4f6" }}>
                    {!activeContact ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                            <div className="text-5xl mb-4">💬</div>
                            <p className="text-sm font-medium">Select a conversation to begin</p>
                        </div>
                    ) : loadingChat ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : contact ? (
                        <>
                            {/* AI Paused Banner */}
                            {contact.isAiPaused && (
                                <div className="bg-orange-50 border-b border-orange-200 px-6 py-2 text-xs text-orange-600 text-center font-medium flex-shrink-0">
                                    ⏸ AI auto-reply paused — you are in manual control
                                </div>
                            )}
                            {/* AI Memory Banner */}
                            {(contact.extractedName || contact.enriched?.location || contact.extractedBudget) && (
                                <div className="bg-indigo-50/80 border-b border-indigo-100 px-6 py-2 text-xs text-indigo-700 flex items-center gap-4 flex-shrink-0">
                                    <span className="font-semibold">🧠 AI Memory:</span>
                                    {contact.extractedName && <span>Name: {contact.extractedName}</span>}
                                    {contact.enriched?.location && <span>📍 {contact.enriched.location}</span>}
                                    {contact.extractedBudget && <span>💰 {contact.extractedBudget}</span>}
                                </div>
                            )}
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                                {grouped.map(({ date, msgs }) => (
                                    <div key={date}>
                                        <div className="flex items-center gap-2 my-3">
                                            <div className="flex-1 h-px bg-zinc-300/60" />
                                            <span className="text-[11px] text-zinc-400 bg-white/70 backdrop-blur-sm border border-zinc-200 rounded-full px-3 py-0.5 font-medium">{date}</span>
                                            <div className="flex-1 h-px bg-zinc-300/60" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {msgs.map(({ msg, idx }) => (
                                                <div key={idx}
                                                    className={`flex flex-col max-w-xs group ${msg.role !== "customer" ? "self-end items-end" : "self-start items-start"}`}>
                                                    <span className="text-[10px] text-zinc-400 mb-1 px-1">
                                                        {msg.role === "customer" ? "Customer" : msg.role === "bot" ? "AI Bot" : "You"}
                                                    </span>
                                                    <div className={`px-4 py-2.5 text-sm leading-relaxed ${MSG_STYLE[msg.role]}`}>
                                                        {msg.text}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 px-1">
                                                        <span className="text-[10px] text-zinc-400">{formatMsgTime(msg.timestamp)}</span>
                                                        {msg.role === "bot" && (
                                                            <button
                                                                onClick={() => setCorrectionTarget({ question: findQuestion(contact.messages, idx), badReply: msg.text, msgIndex: idx })}
                                                                className="text-[10px] text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                                                                ✏️ Correct
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                            {/* Send Box */}
                            <div className="bg-white/90 backdrop-blur-sm border-t border-zinc-200 px-4 py-3 flex-shrink-0">
                                <div className="flex gap-2 items-end">
                                    <textarea value={message} onChange={e => setMessage(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                        placeholder="Type a message to send via WhatsApp..."
                                        rows={1}
                                        className="flex-1 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm bg-white text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-zinc-400 shadow-sm" />
                                    <button onClick={sendMessage} disabled={sending || !message.trim()}
                                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 transition-all shadow-sm flex-shrink-0">
                                        {sending ? "..." : "Send"}
                                    </button>
                                </div>
                                <p className="text-[10px] text-zinc-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* ── RIGHT: Intel Panel ── */}
                {contact && (
                    <div className="w-72 bg-white border-l border-zinc-200 flex flex-col overflow-y-auto flex-shrink-0">
                        {/* Contact Intel */}
                        <div className="p-5 border-b border-zinc-100">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Contact Intel</p>
                            <div className="space-y-2">
                                {[
                                    { label: "Lead", value: contact.leadScore },
                                    { label: "Budget", value: contact.extractedBudget },
                                    { label: "Company", value: contact.enriched?.company },
                                    { label: "Location", value: contact.enriched?.location },
                                    { label: "Email", value: contact.enriched?.email },
                                ].filter(r => r.value).map(r => (
                                    <div key={r.label} className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-500">{r.label}</span>
                                        <span className={`text-xs font-semibold ${r.label === "Lead" ? LEAD_BADGE[contact.leadScore as LeadScore] + " px-2 py-0.5 rounded-md" : "text-zinc-900"}`}>
                                            {r.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* AI Summary */}
                        {contact.summary && (
                            <div className="p-5 border-b border-zinc-100">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">AI Summary</p>
                                <p className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-xl p-3 leading-relaxed">{contact.summary}</p>
                            </div>
                        )}
                        {/* Private Notes */}
                        <div className="p-5">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Private Notes</p>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                placeholder="Add private notes..."
                                rows={5}
                                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-xs bg-white text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 placeholder:text-zinc-400 shadow-sm" />
                            <button onClick={saveNotes} disabled={savingNotes}
                                className="mt-2 w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium py-2 rounded-lg transition-all">
                                {savingNotes ? "Saving..." : "Save Notes"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
