"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface Log {
    _id: string;
    actorEmail: string;
    actorName: string;
    action: string;
    targetEmail?: string;
    details?: string;
    createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
    SUSPEND_USER:        "bg-red-50 text-red-600 border-red-100",
    ACTIVATE_USER:       "bg-emerald-50 text-emerald-600 border-emerald-100",
    DELETE_USER:         "bg-red-100 text-red-700 border-red-200",
    UPDATE_CREDITS:      "bg-blue-50 text-blue-600 border-blue-100",
    CHANGE_ROLE:         "bg-violet-50 text-violet-600 border-violet-100",
    TOGGLE_FEATURE_FLAG: "bg-orange-50 text-orange-600 border-orange-100",
    ANSWER_QUESTION:     "bg-teal-50 text-teal-600 border-teal-100",
    WIPE_USER_CONVERSATIONS: "bg-red-100 text-red-700 border-red-200",
    FORCE_LOGOUT_ALL:    "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("");

    useEffect(() => { fetchLogs(); }, []);

    async function fetchLogs() {
        const params = new URLSearchParams({ limit: "100" });
        if (actionFilter) params.set("action", actionFilter);
        const res = await fetch(`/api/admin/logs?${params}`);
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    const filtered = logs.filter(l =>
        l.actorEmail.includes(search) ||
        (l.targetEmail || "").includes(search) ||
        l.action.includes(search.toUpperCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1">
                    <ClipboardList className="w-3.5 h-3.5" />
                    Audit Logs
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Activity History</h1>
                <p className="text-slate-500 text-sm mt-1">Full record of every critical action taken on the platform.</p>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by email or action..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-sm"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        value={actionFilter}
                        onChange={e => { setActionFilter(e.target.value); setTimeout(fetchLogs, 100); }}
                        className="bg-white border border-slate-200 rounded-xl pl-11 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-sm appearance-none"
                    >
                        <option value="">All Actions</option>
                        {Object.keys(ACTION_COLORS).map(a => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
                    </select>
                </div>
            </div>

            {/* Logs */}
            {filtered.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                    <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No audit logs found yet. Actions you take will appear here.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((log, i) => (
                        <motion.div
                            key={log._id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4"
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border flex-shrink-0 ${ACTION_COLORS[log.action] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
                                {log.action.replace(/_/g, " ")}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-slate-700 font-medium truncate">{log.details || "—"}</div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                    by <span className="font-medium text-slate-600">{log.actorEmail}</span>
                                    {log.targetEmail && <> → <span className="font-medium text-slate-600">{log.targetEmail}</span></>}
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 flex-shrink-0">
                                {new Date(log.createdAt).toLocaleString()}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
