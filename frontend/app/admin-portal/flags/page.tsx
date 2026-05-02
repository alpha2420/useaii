"use client";

import { useEffect, useState } from "react";
import { Flag, Save } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureFlag {
    key: string;
    label: string;
    description: string;
    value: boolean;
}

export default function FeatureFlagsPage() {
    const [flags, setFlags] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [toast, setToast] = useState("");

    useEffect(() => { fetchFlags(); }, []);

    async function fetchFlags() {
        const res = await fetch("/api/admin/flags");
        const data = await res.json();
        setFlags(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    async function toggleFlag(key: string, currentValue: boolean) {
        setSaving(key);
        const newValue = !currentValue;
        await fetch("/api/admin/flags", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: newValue })
        });
        setFlags(prev => prev.map(f => f.key === key ? { ...f, value: newValue } : f));
        setSaving(null);
        setToast(`"${flags.find(f => f.key === key)?.label}" ${newValue ? "enabled" : "disabled"}`);
        setTimeout(() => setToast(""), 3000);
    }

    const flagColors: Record<string, { bg: string; border: string; icon: string }> = {
        "allow_registration": { bg: "bg-blue-50",   border: "border-blue-100",   icon: "text-blue-600" },
        "whatsapp_enabled":   { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-600" },
        "ai_caching_enabled": { bg: "bg-violet-50",  border: "border-violet-100",  icon: "text-violet-600" },
        "maintenance_mode":   { bg: "bg-orange-50",  border: "border-orange-100",  icon: "text-orange-600" },
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1">
                    <Flag className="w-3.5 h-3.5" />
                    Feature Flags
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Platform Controls</h1>
                <p className="text-slate-500 text-sm mt-1">Toggle platform-wide features on or off instantly. Changes take effect immediately.</p>
            </div>

            <div className="space-y-4">
                {flags.map((flag, i) => {
                    const colors = flagColors[flag.key] || { bg: "bg-slate-50", border: "border-slate-100", icon: "text-slate-600" };
                    return (
                        <motion.div
                            key={flag.key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border} flex-shrink-0`}>
                                    <Flag className={`w-5 h-5 ${colors.icon}`} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{flag.label}</div>
                                    <div className="text-sm text-slate-400 mt-0.5">{flag.description}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <span className={`text-xs font-bold uppercase tracking-wider ${flag.value ? "text-emerald-600" : "text-slate-400"}`}>
                                    {flag.value ? "ON" : "OFF"}
                                </span>
                                <button
                                    onClick={() => toggleFlag(flag.key, flag.value)}
                                    disabled={saving === flag.key}
                                    className={`relative w-12 h-6 rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-300 ${flag.value ? "bg-emerald-500" : "bg-slate-200"} ${saving === flag.key ? "opacity-50" : ""}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${flag.value ? "translate-x-6" : "translate-x-0"}`} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Maintenance Mode Warning */}
            {flags.find(f => f.key === "maintenance_mode")?.value && (
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Save className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                        <div className="font-bold text-orange-800">Maintenance Mode is Active</div>
                        <div className="text-sm text-orange-700 mt-1">All your users will see a maintenance banner on their dashboards right now. Remember to turn this off when you're done!</div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    {toast}
                </div>
            )}
        </div>
    );
}
