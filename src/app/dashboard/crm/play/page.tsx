"use client";
 
import { useEffect, useState } from "react";
import Link from "next/link";
 
type LeadScore = "hot" | "warm" | "cold";
type ActionType = "follow_up" | "send_pricing" | "close" | "nurture" | "escalate" | "none";
type CRMStage = "new" | "contacted" | "interested" | "negotiating" | "won" | "lost";
 
interface Task {
    _id: string;
    contactNumber: string;
    contactName: string;
    extractedName: string | null;
    leadScore: LeadScore;
    urgency: "high" | "medium" | "low";
    nextBestAction: string | null;
    nextBestActionType: ActionType | null;
    summary: string | null;
    extractedBudget: string | null;
    stage: CRMStage;
    enriched: {
        company: string | null;
        location: string | null;
        language: string | null;
    };
    lastMessageAt: string;
}
 
const ACTION_STYLES: Record<ActionType, { bg: string; text: string; icon: string }> = {
    close:        { bg: "bg-green-100", text: "text-green-700", icon: "" },
    send_pricing: { bg: "bg-blue-100",  text: "text-blue-700",  icon: "" },
    follow_up:    { bg: "bg-purple-100",text: "text-purple-700",icon: "" },
    escalate:     { bg: "bg-red-100",   text: "text-red-700",   icon: "" },
    nurture:      { bg: "bg-orange-100",text: "text-orange-600",icon: "" },
    none:         { bg: "bg-gray-100",  text: "text-gray-500",  icon: ""  },
};
 
const LEAD_DOT: Record<LeadScore, string> = {
    hot: "bg-red-500",
    warm: "bg-orange-400",
    cold: "bg-blue-400",
};
 
const URGENCY_LABEL: Record<string, string> = {
    high: " High",
    medium: " Medium",
    low: " Low",
};
 
// Priority score for sorting: hot+high urgency first
function priorityScore(t: Task): number {
    const lead = { hot: 3, warm: 2, cold: 1 }[t.leadScore] || 0;
    const urg  = { high: 3, medium: 2, low: 1 }[t.urgency] || 0;
    const act  = t.nextBestActionType === "close" ? 2 : t.nextBestActionType === "escalate" ? 2 : 0;
    return lead * 10 + urg * 3 + act;
}
 
export default function TaskPlayPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [done, setDone] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<"all" | ActionType>("all");
 
    useEffect(() => { fetchTasks(); }, []);
 
    async function fetchTasks() {
        setLoading(true);
        try {
            const res = await fetch("/api/crm");
            const data = await res.json();
            const sorted: Task[] = (data.contacts || [])
                .filter((c: Task) => c.nextBestAction && c.nextBestActionType !== "none")
                .sort((a: Task, b: Task) => priorityScore(b) - priorityScore(a));
            setTasks(sorted);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }
 
    async function markDone(contactNumber: string, stage: CRMStage) {
        // Mark as contacted if it was new
        const nextStage = stage === "new" ? "contacted" : stage;
        await fetch("/api/crm", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactNumber, stage: nextStage }),
        });
        setDone((prev) => new Set([...prev, contactNumber]));
    }
 
    const displayName = (t: Task) =>
        t.extractedName || t.contactName || t.contactNumber.replace("@c.us", "");
 
    const ACTION_TYPES: ActionType[] = ["close", "escalate", "send_pricing", "follow_up", "nurture"];
 
    const filtered = filter === "all"
        ? tasks
        : tasks.filter((t) => t.nextBestActionType === filter);
 
    const remaining = filtered.filter((t) => !done.has(t.contactNumber));
    const completed = filtered.filter((t) => done.has(t.contactNumber));
 
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
 
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Task Play</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Your prioritized action list — work through these to close more deals
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center">
                        <p className="text-2xl font-bold text-gray-900">{remaining.length}</p>
                        <p className="text-xs text-gray-400">remaining</p>
                    </div>
                </div>
 
                {/* Progress bar */}
                {tasks.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Progress</span>
                            <span>{done.size} / {filtered.length} done</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gray-900 rounded-full transition-all duration-500"
                                style={{ width: `${filtered.length > 0 ? (done.size / filtered.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                )}
 
                {/* Filter by action type */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            filter === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200"
                        }`}
                    >
                        All Tasks
                    </button>
                    {ACTION_TYPES.map((a) => {
                        const s = ACTION_STYLES[a];
                        return (
                            <button
                                key={a}
                                onClick={() => setFilter(a)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                                    filter === a
                                        ? `${s.bg} ${s.text} border-transparent`
                                        : "bg-white text-gray-600 border-gray-200"
                                }`}
                            >
                                {ACTION_STYLES[a].icon} {a.replace("_", " ")}
                            </button>
                        );
                    })}
                </div>
 
                {loading ? (
                    <div className="text-center text-gray-400 py-20">Loading tasks...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3"></p>
                        <p className="text-gray-500 font-medium">No pending tasks</p>
                        <p className="text-gray-400 text-sm mt-1">Tasks appear automatically after AI analyzes conversations</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {remaining.map((task, idx) => {
                            const actionStyle = ACTION_STYLES[task.nextBestActionType || "none"];
                            return (
                                <div
                                    key={task._id}
                                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Priority number */}
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
                                            {idx + 1}
                                        </div>
 
                                        <div className="flex-1 min-w-0">
                                            {/* Contact info */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900">{displayName(task)}</span>
                                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                                    task.leadScore === "hot" ? "bg-red-100 text-red-700" :
                                                    task.leadScore === "warm" ? "bg-orange-100 text-orange-600" :
                                                    "bg-blue-100 text-blue-600"
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${LEAD_DOT[task.leadScore]}`} />
                                                    {task.leadScore}
                                                </span>
                                                <span className="text-xs text-gray-400">{URGENCY_LABEL[task.urgency]}</span>
                                            </div>
 
                                            {/* Enriched info */}
                                            <div className="flex gap-3 text-xs text-gray-400 mb-3">
                                                {task.enriched?.company && <span> {task.enriched.company}</span>}
                                                {task.enriched?.location && <span> {task.enriched.location}</span>}
                                                {task.extractedBudget && <span> {task.extractedBudget}</span>}
                                                {task.enriched?.language && <span> {task.enriched.language}</span>}
                                            </div>
 
                                            {/* Summary */}
                                            {task.summary && (
                                                <p className="text-sm text-gray-600 mb-3">{task.summary}</p>
                                            )}
 
                                            {/* Next Best Action */}
                                            {task.nextBestAction && (
                                                <div className={`inline-flex items-start gap-2 px-3 py-2 rounded-lg text-sm font-medium ${actionStyle.bg} ${actionStyle.text} mb-4`}>
                                                    <span>{actionStyle.icon}</span>
                                                    <span>{task.nextBestAction}</span>
                                                </div>
                                            )}
 
                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/dashboard/crm/chat?contact=${encodeURIComponent(task.contactNumber)}`}
                                                    className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-all"
                                                >
                                                    Open Chat →
                                                </Link>
                                                <button
                                                    onClick={() => markDone(task.contactNumber, task.stage)}
                                                    className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-xs font-medium rounded-lg hover:bg-green-100 transition-all"
                                                >
                                                     Mark Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
 
                        {/* Completed section */}
                        {completed.length > 0 && (
                            <div className="mt-6">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                    Completed ({completed.length})
                                </p>
                                {completed.map((task) => (
                                    <div key={task._id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-2 opacity-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 line-through">{displayName(task)}</span>
                                            <span className="text-xs text-green-600 font-medium"> Done</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
