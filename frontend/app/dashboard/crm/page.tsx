"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LeadScore = "hot" | "warm" | "cold";
type CRMStage = "new" | "contacted" | "interested" | "negotiating" | "won" | "lost";

interface Contact {
    _id: string;
    contactNumber: string;
    contactName: string;
    intent: string;
    urgency: string;
    leadScore: LeadScore;
    extractedName: string | null;
    extractedBudget: string | null;
    summary: string | null;
    stage: CRMStage;
    notes: string;
    isAiPaused: boolean;
    lastMessageAt: string;
}

interface Stats {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    won: number;
    newLeads: number;
}

const STAGES: CRMStage[] = ["new", "contacted", "interested", "negotiating", "won", "lost"];

const STAGE_COLORS: Record<CRMStage, string> = {
    new: "bg-zinc-100 text-zinc-600",
    contacted: "bg-blue-50 text-blue-700",
    interested: "bg-purple-50 text-purple-700",
    negotiating: "bg-amber-50 text-amber-700",
    won: "bg-emerald-50 text-emerald-700",
    lost: "bg-red-50 text-red-600",
};

const LEAD_COLORS: Record<LeadScore, string> = {
    hot: "bg-red-50 text-red-700 border border-red-200",
    warm: "bg-amber-50 text-amber-700 border border-amber-200",
    cold: "bg-blue-50 text-blue-600 border border-blue-200",
};

const LEAD_DOT: Record<LeadScore, string> = {
    hot: "bg-red-500",
    warm: "bg-amber-400",
    cold: "bg-blue-400",
};

const INTENT_ICON: Record<string, string> = {
    buying: "",
    inquiry: "",
    complaint: "",
    spam: "",
    unknown: "—",
};

const URGENCY_STYLE: Record<string, string> = {
    high: "text-red-600 font-semibold",
    medium: "text-amber-600",
    low: "text-zinc-400",
};

export default function CRMPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [view, setView] = useState<"list" | "kanban">("list");
    const [loading, setLoading] = useState(true);
    const [stageFilter, setStageFilter] = useState<CRMStage | "all">("all");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchContacts(); }, [stageFilter]);

    // Auto-refresh every 10s
    useEffect(() => {
        const interval = setInterval(fetchContacts, 10000);
        return () => clearInterval(interval);
    }, [stageFilter]);

    async function fetchContacts() {
        try {
            const url = stageFilter === "all" ? "/api/crm" : `/api/crm?stage=${stageFilter}`;
            const res = await fetch(url);
            const data = await res.json();
            setContacts(data.contacts || []);
            setStats(data.stats || null);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function updateStage(contactNumber: string, stage: CRMStage) {
        setUpdatingId(contactNumber);
        try {
            await fetch("/api/crm", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactNumber, stage }),
            });
            setContacts((prev) =>
                prev.map((c) => c.contactNumber === contactNumber ? { ...c, stage } : c)
            );
        } finally { setUpdatingId(null); }
    }

    function formatTime(iso: string) {
        const d = new Date(iso);
        const diff = Date.now() - d.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString();
    }

    const contactsByStage = (stage: CRMStage) =>
        filteredContacts.filter((c) => c.stage === stage);

    const displayName = (c: Contact) =>
        c.extractedName || c.contactName || c.contactNumber.replace("@c.us", "");

    const filteredContacts = contacts.filter((c) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            displayName(c).toLowerCase().includes(q) ||
            c.contactNumber.includes(q) ||
            c.summary?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* ── Top Navigation ── */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-zinc-400 hover:text-zinc-700 text-sm transition"
                        >
                            ← Dashboard
                        </button>
                        <div className="w-px h-4 bg-zinc-200" />
                        <h1 className="text-base font-semibold text-zinc-900">CRM</h1>
                        {stats && (
                            <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium">
                                {stats.total} contacts
                            </span>
                        )}
                        <div className="w-px h-4 bg-zinc-200 ml-2" />
                        <button 
                            onClick={() => router.push("/dashboard/analytics")}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-medium hover:bg-indigo-700 transition shadow-sm"
                        >
                             Insights
                        </button>
                        <button 
                            onClick={() => router.push("/dashboard/crm/play")}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-[11px] font-medium hover:bg-zinc-800 transition shadow-sm"
                        >
                             Play Mode
                        </button>
                        <button 
                            onClick={() => router.push("/dashboard/agent-instructions")}
                            className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 bg-white text-[11px] font-medium hover:bg-zinc-50 transition"
                        >
                             AI Rules
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search contacts..."
                            className="w-48 text-xs border border-zinc-200 rounded-lg px-3 py-1.5 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:bg-white transition"
                        />
                        {/* Refresh */}
                        <button
                            onClick={() => fetchContacts()}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition text-sm"
                            title="Refresh"
                        >
                            ↻
                        </button>
                        {/* View Toggle */}
                        <div className="flex rounded-lg border border-zinc-200 overflow-hidden">
                            <button
                                onClick={() => setView("list")}
                                className={`px-3 py-1.5 text-xs font-medium transition ${view === "list" ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 hover:bg-zinc-50"}`}
                            >
                                List
                            </button>
                            <button
                                onClick={() => setView("kanban")}
                                className={`px-3 py-1.5 text-xs font-medium transition ${view === "kanban" ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 hover:bg-zinc-50"}`}
                            >
                                Board
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
                {/* ── Stats Row ── */}
                {stats && (
                    <div className="grid grid-cols-6 gap-2">
                        {[
                            { label: "Total", value: stats.total, color: "text-zinc-900", bg: "bg-white" },
                            { label: "New", value: stats.newLeads, color: "text-zinc-600", bg: "bg-white" },
                            { label: "Hot", value: stats.hot, color: "text-red-600", bg: "bg-red-50" },
                            { label: "Warm", value: stats.warm, color: "text-amber-600", bg: "bg-amber-50" },
                            { label: "Cold", value: stats.cold, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Won", value: stats.won, color: "text-emerald-600", bg: "bg-emerald-50" },
                        ].map((s) => (
                            <div key={s.label} className={`${s.bg} rounded-xl border border-zinc-200/80 px-4 py-3 flex items-center justify-between`}>
                                <span className="text-xs text-zinc-500 font-medium">{s.label}</span>
                                <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── LIST VIEW ── */}
                {view === "list" && (
                    <>
                        {/* Stage filter pills */}
                        <div className="flex gap-1.5 flex-wrap">
                            {(["all", ...STAGES] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStageFilter(s)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition capitalize ${
                                        stageFilter === s
                                            ? "bg-zinc-900 text-white shadow-sm"
                                            : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                            {loading ? (
                                <div className="p-16 text-center">
                                    <div className="text-zinc-300 text-sm">Loading contacts...</div>
                                </div>
                            ) : filteredContacts.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="text-2xl mb-2"></div>
                                    <p className="text-sm text-zinc-500 font-medium">No conversations yet</p>
                                    <p className="text-xs text-zinc-400 mt-1">When customers message your WhatsApp, they'll appear here automatically.</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                            <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium uppercase tracking-wider">Contact</th>
                                            <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium uppercase tracking-wider">Lead</th>
                                            <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium uppercase tracking-wider">Intent</th>
                                            <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium uppercase tracking-wider">Stage</th>
                                            <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium uppercase tracking-wider">Summary</th>
                                            <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium uppercase tracking-wider">Active</th>
                                            <th className="text-right px-4 py-2.5"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredContacts.map((c, i) => (
                                            <tr
                                                key={c._id}
                                                className={`hover:bg-zinc-50/80 transition-colors cursor-pointer ${i !== filteredContacts.length - 1 ? "border-b border-zinc-100" : ""}`}
                                                onClick={() => router.push(`/dashboard/crm/chat?contact=${encodeURIComponent(c.contactNumber)}`)}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center text-xs font-bold text-zinc-600 flex-shrink-0">
                                                            {displayName(c).charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-zinc-900 text-sm">{displayName(c)}</div>
                                                            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                                                                {c.contactNumber.replace("@c.us", "")}
                                                                {c.isAiPaused && (
                                                                    <span className="text-[10px] text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded font-medium">MANUAL</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${LEAD_COLORS[c.leadScore]}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${LEAD_DOT[c.leadScore]}`} />
                                                        {c.leadScore}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm" title={c.intent}>
                                                        {INTENT_ICON[c.intent] || "—"}
                                                    </span>
                                                    <span className={`ml-1.5 text-[11px] ${URGENCY_STYLE[c.urgency] || "text-zinc-400"}`}>
                                                        {c.urgency === "high" ? "↑" : c.urgency === "medium" ? "→" : "↓"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={c.stage}
                                                        disabled={updatingId === c.contactNumber}
                                                        onChange={(e) => updateStage(c.contactNumber, e.target.value as CRMStage)}
                                                        className="text-[11px] border border-zinc-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-300 capitalize cursor-pointer"
                                                    >
                                                        {STAGES.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 max-w-[240px]">
                                                    <p className="text-xs text-zinc-500 truncate">
                                                        {c.summary || <span className="text-zinc-300 italic">Pending analysis...</span>}
                                                    </p>
                                                    {c.extractedBudget && (
                                                        <span className="text-[10px] text-emerald-600 font-medium"> {c.extractedBudget}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-[11px] text-zinc-400">
                                                    {formatTime(c.lastMessageAt)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-zinc-300 text-sm">›</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* ── KANBAN VIEW ── */}
                {view === "kanban" && (
                    <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
                        {STAGES.map((stage) => (
                            <div key={stage} className="flex-shrink-0 w-60">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize ${STAGE_COLORS[stage]}`}>
                                        {stage}
                                    </span>
                                    <span className="text-[11px] text-zinc-400 font-medium tabular-nums">
                                        {contactsByStage(stage).length}
                                    </span>
                                </div>
                                <div className="space-y-2 min-h-[80px]">
                                    {loading ? (
                                        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center text-zinc-300 text-xs">
                                            Loading...
                                        </div>
                                    ) : contactsByStage(stage).length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-center text-zinc-300 text-[11px]">
                                            Empty
                                        </div>
                                    ) : (
                                        contactsByStage(stage).map((c) => (
                                            <Link
                                                key={c._id}
                                                href={`/dashboard/crm/chat?contact=${encodeURIComponent(c.contactNumber)}`}
                                                className="block bg-white rounded-xl border border-zinc-200 p-3 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all"
                                            >
                                                <div className="flex items-start justify-between mb-1.5">
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-zinc-900 text-sm truncate">{displayName(c)}</p>
                                                        <p className="text-[11px] text-zinc-400 truncate">{c.contactNumber.replace("@c.us", "")}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${LEAD_COLORS[c.leadScore]}`}>
                                                        <span className={`w-1 h-1 rounded-full ${LEAD_DOT[c.leadScore]}`} />
                                                        {c.leadScore}
                                                    </span>
                                                </div>
                                                {c.summary && (
                                                    <p className="text-[11px] text-zinc-500 mb-2 line-clamp-2 leading-relaxed">{c.summary}</p>
                                                )}
                                                <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100">
                                                    <span className="text-[10px] text-zinc-300">{formatTime(c.lastMessageAt)}</span>
                                                    {c.extractedBudget && (
                                                        <span className="text-[10px] text-emerald-600 font-medium"> {c.extractedBudget}</span>
                                                    )}
                                                </div>
                                                {c.isAiPaused && (
                                                    <div className="mt-1.5 text-[10px] text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-center font-medium">
                                                        Manual mode
                                                    </div>
                                                )}
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
