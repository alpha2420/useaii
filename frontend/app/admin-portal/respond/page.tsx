"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, Check, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
    _id: string;
    question: string;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    source: string;
    category: string;
    frequency: number;
    status: string;
    createdAt: string;
}

export default function RespondPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [ownerFilter, setOwnerFilter] = useState("");

    useEffect(() => { fetchQuestions(); }, []);

    async function fetchQuestions() {
        const res = await fetch("/api/admin/respond?status=unanswered");
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    async function submitAnswer(questionId: string) {
        const answer = answers[questionId];
        if (!answer?.trim()) return;
        setSubmitting(questionId);
        await fetch("/api/admin/respond", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId, answer })
        });
        setQuestions(prev => prev.filter(q => q._id !== questionId));
        setSubmitting(null);
    }

    const owners = [...new Set(questions.map(q => q.ownerName))];
    const filtered = ownerFilter ? questions.filter(q => q.ownerName === ownerFilter) : questions;

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Respond to Users
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Unanswered Questions</h1>
                    <p className="text-slate-500 text-sm mt-1">Answer unresolved questions from all businesses on the platform.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-violet-600">{questions.length}</div>
                    <div className="text-xs text-slate-400">Pending</div>
                </div>
            </div>

            {/* Filter by owner */}
            {owners.length > 1 && (
                <div className="flex items-center gap-3 mb-6">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setOwnerFilter("")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${!ownerFilter ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                            All Businesses
                        </button>
                        {owners.map(owner => (
                            <button
                                key={owner}
                                onClick={() => setOwnerFilter(owner)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${ownerFilter === owner ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                                {owner}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <Check className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
                    <p className="text-slate-500">No unanswered questions across any businesses right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((q, i) => (
                        <motion.div
                            key={q._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-3 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-lg font-semibold">{q.ownerName}</span>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{q.source}</span>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{q.category}</span>
                                        {q.frequency > 1 && (
                                            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg font-semibold">Asked {q.frequency}x</span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-slate-900">{q.question}</p>
                                    <p className="text-xs text-slate-400 mt-1">{new Date(q.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <textarea
                                    rows={2}
                                    placeholder="Type your answer here..."
                                    value={answers[q._id] || ""}
                                    onChange={e => setAnswers(prev => ({ ...prev, [q._id]: e.target.value }))}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
                                />
                                <button
                                    onClick={() => submitAnswer(q._id)}
                                    disabled={submitting === q._id || !answers[q._id]?.trim()}
                                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all self-start"
                                >
                                    <Send className="w-4 h-4" />
                                    {submitting === q._id ? "Saving..." : "Answer"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
