"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AICorrection {
    _id: string;
    contactNumber: string;
    originalQuestion: string;
    badReply: string;
    correctReply: string;
    createdAt: string;
}

export default function CorrectionsPage() {
    const [corrections, setCorrections] = useState<AICorrection[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchCorrections(); }, []);

    async function fetchCorrections() {
        setLoading(true);
        try {
            const res = await fetch("/api/corrections");
            const data = await res.json();
            setCorrections(data.corrections || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function deleteCorrection(id: string) {
        setDeleting(id);
        try {
            await fetch(`/api/corrections?id=${id}`, { method: "DELETE" });
            setCorrections((prev) => prev.filter((c) => c._id !== id));
        } finally { setDeleting(null); }
    }

    const filtered = corrections.filter((c) =>
        c.originalQuestion.toLowerCase().includes(search.toLowerCase()) ||
        c.correctReply.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-12">

            {/* Ambient */}
            <div className="fixed top-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(110,231,183,0.04) 0%, transparent 70%)" }} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 space-y-8">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">🧠</span>
                            <h1 className="text-2xl font-bold text-zinc-900">AI Learning History</h1>
                        </div>
                        <p className="text-sm text-zinc-500 mt-1">
                            Every correction you make teaches the AI. It will never repeat these mistakes.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/crm"
                        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        ← Back to CRM
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Corrections", value: corrections.length, icon: "📝", color: "text-zinc-900" },
                        { label: "This Week", value: corrections.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 86400000)).length, icon: "📅", color: "text-emerald-600" },
                        { label: "AI Accuracy", value: corrections.length > 0 ? "Improving" : "Baseline", icon: "📈", color: "text-indigo-600" },
                    ].map((s) => (
                        <div key={s.label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                            <div className="text-xl mb-1">{s.icon}</div>
                            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* How it works */}
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-indigo-900 mb-2">How AI Learning works</p>
                    <div className="grid grid-cols-3 gap-4 text-xs text-indigo-800">
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">1.</span>
                            <span>AI gives a wrong answer in chat</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">2.</span>
                            <span>You hover over it and click "Correct this"</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">3.</span>
                            <span>AI injects the correction into every reply — instantly smarter</span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                {corrections.length > 0 && (
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search corrections..."
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-sm"
                    />
                )}

                {/* Corrections list */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
                    </div>
                ) : corrections.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-200 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                        <p className="text-4xl mb-3">🌱</p>
                        <p className="text-zinc-600 font-medium">No corrections yet</p>
                        <p className="text-zinc-500 text-sm mt-1">
                            Open a chat, hover over a bot reply, and click "Correct this" to start teaching your AI
                        </p>
                        <Link
                            href="/dashboard/crm"
                            className="inline-block mt-4 px-5 py-2 rounded-xl text-sm font-medium text-black"
                            style={{ background: "linear-gradient(135deg, #6ee7b7, #34d399)" }}
                        >
                            Open CRM →
                        </Link>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 text-sm">No corrections match your search</div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((c) => (
                            <div
                                key={c._id}
                                className="rounded-2xl border border-zinc-200 bg-white p-5 hover:bg-zinc-50 transition-all shadow-sm"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded-full border border-zinc-200">
                                            {c.contactNumber.replace("@c.us", "")}
                                        </span>
                                        <span className="text-xs text-zinc-400">
                                            {new Date(c.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteCorrection(c._id)}
                                        disabled={deleting === c._id}
                                        className="text-xs text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-40"
                                    >
                                        {deleting === c._id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>

                                {/* Question */}
                                <div className="mb-3">
                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Customer asked</p>
                                    <p className="text-sm text-zinc-900">{c.originalQuestion}</p>
                                </div>

                                {/* Bad → Good */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-red-600 mb-1">❌ AI said</p>
                                        <p className="text-xs text-red-900/60 line-through">{c.badReply}</p>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-emerald-600 mb-1">✅ Correct answer</p>
                                        <p className="text-xs text-emerald-900">{c.correctReply}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
