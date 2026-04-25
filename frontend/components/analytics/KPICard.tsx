"use client";

import { AnimatedNumber } from "./AnimatedNumber";

export function KPICard({
    icon, label, value, delta, accent, sub,
}: {
    icon: string;
    label: string;
    value: number;
    delta?: string;
    accent: string;
    sub?: string;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 hover:border-zinc-300 hover:shadow-md transition-all group shadow-sm cursor-default">
            {/* Accent glow */}
            <div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl"
                style={{ background: accent }}
            />
            <div className="flex items-start justify-between mb-3">
                <span className="text-2xl drop-shadow-sm">{icon}</span>
                {delta && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                        {delta}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold text-zinc-900 tracking-tight">
                <AnimatedNumber value={value} />
            </div>
            <div className="text-sm text-zinc-500 mt-1 font-medium">{label}</div>
            {sub && <div className="text-xs text-zinc-400 mt-0.5 font-medium">{sub}</div>}
        </div>
    );
}
