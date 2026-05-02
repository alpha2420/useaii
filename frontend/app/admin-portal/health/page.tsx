"use client";

import { useEffect, useState } from "react";
import { Heart, RefreshCw, CheckCircle, AlertCircle, Cpu, Database, Zap, Server } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCheck {
    name: string;
    status: "operational" | "degraded";
    latency: number;
    error?: string;
}

interface Meta {
    userCount: number;
    nodeVersion: string;
    uptime: number;
    memoryMB: number;
    checkedAt: string;
}

const SERVICE_ICONS: Record<string, any> = {
    "MongoDB":          Database,
    "Gemini API":       Zap,
    "WhatsApp Gateway": Server,
};

function formatUptime(seconds: number) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
}

export default function SystemHealthPage() {
    const [services, setServices] = useState<ServiceCheck[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    useEffect(() => { fetchHealth(); }, []);
    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    async function fetchHealth() {
        setRefreshing(true);
        const res = await fetch("/api/admin/health");
        const data = await res.json();
        setServices(data.services || []);
        setMeta(data.meta || null);
        setLastChecked(new Date());
        setLoading(false);
        setRefreshing(false);
    }

    const allOperational = services.every(s => s.status === "operational");

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1">
                        <Heart className="w-3.5 h-3.5" />
                        System Health
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Platform Status</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time checks on all services. Auto-refreshes every 30 seconds.</p>
                </div>
                <button onClick={fetchHealth} disabled={refreshing} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh Now
                </button>
            </div>

            {/* Overall Status Banner */}
            <div className={`rounded-2xl p-5 mb-8 flex items-center gap-4 ${allOperational ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                {allOperational
                    ? <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                    : <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                }
                <div>
                    <div className={`font-bold text-lg ${allOperational ? "text-emerald-700" : "text-red-700"}`}>
                        {allOperational ? "All Systems Operational" : "Service Degradation Detected"}
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                        Last checked: {lastChecked?.toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {services.map((service, i) => {
                    const Icon = SERVICE_ICONS[service.name] || Server;
                    return (
                        <motion.div
                            key={service.name}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white border rounded-2xl p-6 shadow-sm ${service.status === "operational" ? "border-slate-200" : "border-red-200"}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${service.status === "operational" ? "bg-emerald-50" : "bg-red-50"}`}>
                                    <Icon className={`w-5 h-5 ${service.status === "operational" ? "text-emerald-600" : "text-red-500"}`} />
                                </div>
                                <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${service.status === "operational" ? "text-emerald-600" : "text-red-600"}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${service.status === "operational" ? "bg-emerald-500" : "bg-red-500"}`} />
                                    {service.status}
                                </div>
                            </div>
                            <div className="font-bold text-slate-900 mb-1">{service.name}</div>
                            <div className="text-sm text-slate-400">
                                {service.status === "operational"
                                    ? `Response: ${service.latency}ms`
                                    : service.error || "Service unavailable"
                                }
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Server Metrics */}
            {meta && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-violet-600" />
                        Server Metrics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Process Uptime",  value: formatUptime(meta.uptime) },
                            { label: "Memory Usage",    value: `${meta.memoryMB} MB` },
                            { label: "Node.js Version", value: meta.nodeVersion },
                            { label: "Total Users",     value: meta.userCount.toString() },
                        ].map(m => (
                            <div key={m.label} className="text-center p-4 bg-slate-50 rounded-xl">
                                <div className="text-xl font-bold text-slate-900">{m.value}</div>
                                <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
