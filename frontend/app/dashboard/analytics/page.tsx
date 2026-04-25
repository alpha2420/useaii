"use client";
 
import { useState } from "react";
import Link from "next/link";
import { AreaChart } from "@/components/analytics/AreaChart";
import { DonutChart } from "@/components/analytics/DonutChart";
import { KPICard } from "@/components/analytics/KPICard";
import { ProgressBar } from "@/components/analytics/ProgressBar";
import { SectionTitle } from "@/components/analytics/SectionTitle";
import { AnimatedNumber } from "@/components/analytics/AnimatedNumber";
import { useDashboardStats } from "@/hooks/useDashboardStats";
 
export default function AnalyticsDashboardPage() {
    const { stats, loading, error, lastUpdated, refetch } = useDashboardStats();
    const [activeTab, setActiveTab] = useState<"overview" | "leads" | "pipeline">("overview");
 
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center space-y-4">
                    <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mx-auto shadow-sm" />
                    <p className="text-zinc-500 text-sm font-medium tracking-wide">Loading dashboard</p>
                </div>
            </div>
        );
    }
 
    if (error || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center bg-red-50 border border-red-100 p-8 rounded-2xl max-w-md shadow-sm">
                    <div className="text-red-500 text-3xl mb-4 drop-shadow-sm">⚠️</div>
                    <h2 className="text-xl font-bold text-red-900 mb-2">API Error</h2>
                    <p className="text-red-700 text-sm font-medium">{error || "Data unavailable"}</p>
                    <button onClick={refetch} className="mt-6 px-4 py-2 bg-white border border-red-200 rounded-lg text-red-700 font-bold hover:bg-red-50 transition-colors shadow-sm">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
 
    const { overview, leads, stages, intents, urgency, last7Days, topUnanswered } = stats;
 
    const totalLeads = (leads?.hot || 0) + (leads?.warm || 0) + (leads?.cold || 0);
    const totalIntents = intents ? Object.values(intents).reduce((a, b) => a + b, 0) : 0;
    const totalStages = stages ? Object.values(stages).reduce((a, b) => a + b, 0) : 0;
    const totalUrgency = urgency ? Object.values(urgency).reduce((a, b) => a + b, 0) : 0;
    const conversionRate = overview?.totalConversations > 0
        ? Math.round((overview.wonDeals / overview.totalConversations) * 100)
        : 0;
 
    const chartData = (last7Days || []).map((d) => ({
        label: d.label ? d.label.split(",")[0] : d.date,
        value: d.count || 0,
    }));
 
    return (
        <div className="min-h-screen text-zinc-900 font-sans bg-[#fafafa]">
 
            {/* Background grid */}
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
            }} />
 
            {/* Ambient blobs */}
            <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(110,231,183,0.15) 0%, transparent 70%)" }} />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />
 
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
 
                {/* ── Header ── */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                            <span className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">Live Insights</span>
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mt-2">Business Dashboard</h1>
                        <p className="text-zinc-500 text-sm mt-1 font-medium">
                            {lastUpdated
                                ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                : "Loading..."}
                            {" · "}Auto-refreshes every 60s
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={refetch}
                            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-sm shadow-sm transition-all"
                        >
                            ↻ Refresh
                        </button>
                        <Link
                            href="/dashboard/crm/tasks"
                            className="px-4 py-2 rounded-xl text-sm font-bold transition-all text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                        >
                            🎮 Task Play
                        </Link>
                    </div>
                </div>
 
                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <KPICard icon="💬" label="Conversations" value={overview?.totalConversations || 0} accent="#10b981" />
                    <KPICard icon="🆕" label="New Today" value={overview?.newToday || 0} accent="#3b82f6" delta={overview?.newToday > 0 ? `+${overview.newToday}` : undefined} />
                    <KPICard icon="🔥" label="Hot Leads" value={overview?.hotLeadsThisWeek || 0} accent="#f97316" sub="this week" />
                    <KPICard icon="✅" label="Won Deals" value={overview?.wonDeals || 0} accent="#10b981" />
                    <KPICard icon="📨" label="Messages" value={overview?.totalMessages || 0} accent="#8b5cf6" />
                    <KPICard icon="📈" label="Conversion" value={conversionRate} accent="#f97316" sub="percent won" />
                </div>
 
                {/* ── Tabs ── */}
                <div className="flex gap-1 p-1 rounded-xl bg-white border border-zinc-200 w-fit shadow-xs">
                    {(["overview", "leads", "pipeline"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                                activeTab === tab
                                    ? "bg-zinc-900 text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
 
                {/* ── Overview Tab ── */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
 
                        {/* Area chart */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <SectionTitle
                                action={
                                    <span className="text-xs text-zinc-500 font-bold bg-zinc-50 px-3 py-1 rounded-full border border-zinc-200">
                                        {(last7Days || []).reduce((a, b) => a + b.count, 0)} total
                                    </span>
                                }
                            >
                                Conversations · Last 7 Days
                            </SectionTitle>
                            <AreaChart data={chartData} color="#10b981" height={140} />
                        </div>
 
                        {/* Row: Donut + Intent + Urgency */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 
                            {/* Lead quality donuts */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                                <SectionTitle>Lead Quality</SectionTitle>
                                <div className="flex justify-center mb-4">
                                    <DonutChart
                                        size={140}
                                        label="leads"
                                        value={totalLeads}
                                        segments={[
                                            { value: leads?.hot || 0, color: "#f97316", label: "hot" },
                                            { value: leads?.warm || 0, color: "#f59e0b", label: "warm" },
                                            { value: leads?.cold || 0, color: "#3b82f6", label: "cold" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <ProgressBar label="Hot" value={leads?.hot || 0} total={totalLeads} color="#f97316" icon="🔥" />
                                    <ProgressBar label="Warm" value={leads?.warm || 0} total={totalLeads} color="#f59e0b" icon="🟠" />
                                    <ProgressBar label="Cold" value={leads?.cold || 0} total={totalLeads} color="#3b82f6" icon="🧊" />
                                </div>
                            </div>
 
                            {/* Customer Intent */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                                <SectionTitle>Customer Intent</SectionTitle>
                                <div className="flex justify-center mb-4">
                                    <DonutChart
                                        size={140}
                                        label="messages"
                                        value={totalIntents}
                                        segments={[
                                            { value: intents?.buying || 0, color: "#10b981", label: "buying" },
                                            { value: intents?.inquiry || 0, color: "#3b82f6", label: "inquiry" },
                                            { value: intents?.complaint || 0, color: "#ef4444", label: "complaint" },
                                            { value: intents?.unknown || 0, color: "#e4e4e7", label: "unknown" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <ProgressBar label="Buying" value={intents?.buying || 0} total={totalIntents} color="#10b981" icon="🛒" />
                                    <ProgressBar label="Inquiry" value={intents?.inquiry || 0} total={totalIntents} color="#3b82f6" icon="❓" />
                                    <ProgressBar label="Complaint" value={intents?.complaint || 0} total={totalIntents} color="#ef4444" icon="⚠️" />
                                    <ProgressBar label="Unknown" value={intents?.unknown || 0} total={totalIntents} color="#d4d4d8" icon="❔" />
                                </div>
                                {(intents?.buying || 0) > 0 && (
                                    <div className="mt-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 font-medium flex items-center justify-between">
                                        <span>💡 {intents.buying} people ready to buy!</span>
                                        <Link href="/dashboard/crm/tasks" className="underline font-bold">Work leads</Link>
                                    </div>
                                )}
                            </div>
 
                            {/* Urgency */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                                <SectionTitle>Urgency Levels</SectionTitle>
                                <div className="flex justify-center mb-4">
                                    <DonutChart
                                        size={140}
                                        label="total"
                                        value={totalUrgency}
                                        segments={[
                                            { value: urgency?.high || 0, color: "#ef4444", label: "high" },
                                            { value: urgency?.medium || 0, color: "#f97316", label: "medium" },
                                            { value: urgency?.low || 0, color: "#71717a", label: "low" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <ProgressBar label="High" value={urgency?.high || 0} total={totalUrgency} color="#ef4444" icon="🔴" />
                                    <ProgressBar label="Medium" value={urgency?.medium || 0} total={totalUrgency} color="#f97316" icon="🟠" />
                                    <ProgressBar label="Low" value={urgency?.low || 0} total={totalUrgency} color="#71717a" icon="⚪" />
                                </div>
                                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                                    <span className="text-xs text-zinc-500 font-bold">Avg msgs / convo</span>
                                    <span className="text-xl font-bold text-zinc-900">{overview?.avgMessagesPerConvo || 0}</span>
                                </div>
                            </div>
                        </div>
 
                        {/* Unanswered questions */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <SectionTitle
                                action={
                                    <Link href="/dashboard" className="text-xs text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                                        + Train AI →
                                    </Link>
                                }
                            >
                                Unanswered Questions
                            </SectionTitle>
                            {(!topUnanswered || topUnanswered.length === 0) ? (
                                <div className="text-center py-10">
                                    <div className="text-4xl mb-3 drop-shadow-sm">🎉</div>
                                    <p className="text-zinc-500 text-sm font-medium">Your AI is answering everything perfectly</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {topUnanswered.map((q, i) => (
                                        <div
                                            key={q._id}
                                            className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 hover:shadow-sm transition-all group"
                                        >
                                            <span className="text-zinc-400 text-sm font-bold w-5 flex-shrink-0 mt-0.5">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 border ${
                                                q.source === "whatsapp"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-blue-50 text-blue-700 border-blue-100"
                                            }`}>
                                                {q.source === "whatsapp" ? "📱 WA" : "🌐 Web"}
                                            </span>
                                            <p className="text-sm text-zinc-700 font-medium flex-1">{q.question}</p>
                                            <span className="text-xs text-zinc-400 font-medium flex-shrink-0">
                                                {new Date(q.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
 
                {/* ── Leads Tab ── */}
                {activeTab === "leads" && (
                    <div className="space-y-6">
 
                        {/* Lead score bar chart */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <SectionTitle>Lead Score Distribution</SectionTitle>
                            <div className="grid grid-cols-3 gap-6 mt-2">
                                {[
                                    { label: "🔥 Hot", value: leads?.hot || 0, color: "#f97316", bg: "bg-orange-50 border-orange-100" },
                                    { label: "🟠 Warm", value: leads?.warm || 0, color: "#f59e0b", bg: "bg-amber-50 border-amber-100" },
                                    { label: "🧊 Cold", value: leads?.cold || 0, color: "#3b82f6", bg: "bg-blue-50 border-blue-100" },
                                ].map((s) => (
                                    <div key={s.label} className={`rounded-2xl border p-6 text-center ${s.bg}`}>
                                        <div className="text-5xl font-bold mb-1" style={{ color: s.color }}>
                                            <AnimatedNumber value={s.value} />
                                        </div>
                                        <div className="text-sm font-bold text-zinc-700">{s.label}</div>
                                        <div className="text-xs text-zinc-500 font-medium mt-1">
                                            {totalLeads > 0 ? Math.round((s.value / totalLeads) * 100) : 0}% of total
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
 
                        {/* Hot leads this week area chart */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <SectionTitle>Conversation Activity</SectionTitle>
                            <AreaChart data={chartData} color="#f97316" height={160} />
                        </div>
 
                        {/* Health score */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <SectionTitle>Business Health Score</SectionTitle>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Hot Leads", ok: (leads?.hot || 0) > 0, tip: `${leads?.hot || 0} ready to convert`, color: "text-orange-500" },
                                    { label: "AI Coverage", ok: (!topUnanswered || topUnanswered.length === 0), tip: (!topUnanswered || topUnanswered.length === 0) ? "Fully covered" : `${topUnanswered.length} gaps`, color: "text-emerald-500" },
                                    { label: "Active Convos", ok: overview?.totalConversations > 0, tip: `${overview?.totalConversations || 0} total`, color: "text-blue-500" },
                                    { label: "Deals Won", ok: overview?.wonDeals > 0, tip: `${overview?.wonDeals || 0} closed`, color: "text-purple-500" },
                                ].map((item) => (
                                    <div key={item.label} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:shadow-sm transition-all cursor-default">
                                        <div className={`text-2xl font-bold mb-1 ${item.ok ? item.color : "text-zinc-300"}`}>
                                            {item.ok ? "✓" : "—"}
                                        </div>
                                        <div className="text-sm font-bold text-zinc-800">{item.label}</div>
                                        <div className="text-xs text-zinc-500 font-medium mt-1">{item.tip}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
 
                {/* ── Pipeline Tab ── */}
                {activeTab === "pipeline" && (
                    <div className="space-y-6">
 
                        {/* Pipeline funnel */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <SectionTitle>Sales Pipeline</SectionTitle>
                            <div className="space-y-3 mt-2">
                                {[
                                    { stage: "new", label: "New", color: "#71717a", icon: "🆕" },
                                    { stage: "contacted", label: "Contacted", color: "#3b82f6", icon: "📞" },
                                    { stage: "interested", label: "Interested", color: "#8b5cf6", icon: "👀" },
                                    { stage: "negotiating", label: "Negotiating", color: "#f97316", icon: "🤝" },
                                    { stage: "won", label: "Won", color: "#10b981", icon: "✅" },
                                    { stage: "lost", label: "Lost", color: "#ef4444", icon: "❌" },
                                ].map(({ stage, label, color, icon }) => {
                                    const val = stages?.[stage] || 0;
                                    const pct = totalStages > 0 ? Math.round((val / totalStages) * 100) : 0;
                                    return (
                                        <div key={stage} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100">
                                            <span className="text-lg w-8 text-center drop-shadow-sm">{icon}</span>
                                            <span className="text-sm font-bold text-zinc-700 w-28">{label}</span>
                                            <div className="flex-1 h-3 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${pct}%`, background: color }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-zinc-900 w-8 text-right">{val}</span>
                                            <span className="text-xs text-zinc-500 font-medium w-10 text-right">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
 
                            {/* Conversion arrow */}
                            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-emerald-800">Overall Conversion Rate</p>
                                    <p className="text-xs text-emerald-600/80 mt-0.5 font-medium">New → Won</p>
                                </div>
                                <div className="text-4xl font-bold text-emerald-600 drop-shadow-sm">{conversionRate}%</div>
                            </div>
                        </div>
 
                        {/* Activity chart */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <SectionTitle>Weekly Activity</SectionTitle>
                            <AreaChart data={chartData} color="#8b5cf6" height={160} />
                        </div>
 
                        {/* Quick links */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { href: "/dashboard/crm/tasks", label: "🎮 Task Play", desc: "Work hot leads" },
                                { href: "/dashboard/crm", label: "📋 CRM", desc: "All contacts" },
                                { href: "/dashboard/settings/agent", label: "🧠 AI Rules", desc: "Agent settings" },
                                { href: "/dashboard", label: "📚 Train AI", desc: "Add knowledge" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="p-4 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                >
                                    <p className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{link.label}</p>
                                    <p className="text-xs text-zinc-500 mt-1 font-medium">{link.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
