"use client";

import { useState } from "react";

export function AreaChart({
    data,
    color = "#10b981", // emerald-500
    height = 120,
}: {
    data: { label: string; value: number }[];
    color?: string;
    height?: number;
}) {
    if (data.length < 2) {
        return (
            <div className="flex items-center justify-center text-zinc-500 font-medium text-sm w-full" style={{ height }}>
                Not enough data points to plot chart
            </div>
        );
    }
 
    const width = 600;
    const pad = { top: 10, right: 10, bottom: 30, left: 30 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const max = Math.max(...data.map((d) => d.value), 1);
 
    const pts = data.map((d, i) => ({
        x: pad.left + (i / (data.length - 1)) * innerW,
        y: pad.top + innerH - (d.value / max) * innerH,
        label: d.label,
        value: d.value,
    }));
 
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${pad.top + innerH} L ${pts[0].x} ${pad.top + innerH} Z`;
 
    const gradId = `grad-${color.replace("#", "")}`;
 
    const [hovered, setHovered] = useState<number | null>(null);
 
    return (
        <div className="relative w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                </defs>
 
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((v) => {
                    const y = pad.top + innerH - v * innerH;
                    return (
                        <g key={v}>
                            <line x1={pad.left} y1={y} x2={pad.left + innerW} y2={y} stroke="#e4e4e7" strokeWidth="1" />
                            <text x={pad.left - 5} y={y + 4} fill="#a1a1aa" fontSize="9" textAnchor="end" fontWeight="500">
                                {Math.round(v * max)}
                            </text>
                        </g>
                    );
                })}
 
                {/* Area fill */}
                <path d={areaPath} fill={`url(#${gradId})`} />
 
                {/* Line */}
                <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 
                {/* X labels */}
                {pts.map((p, i) => (
                    <text key={i} x={p.x} y={pad.top + innerH + 18} fill="#a1a1aa" fontSize="9" textAnchor="middle" fontWeight="500">
                        {p.label}
                    </text>
                ))}
 
                {/* Interactive dots */}
                {pts.map((p, i) => (
                    <g key={i}>
                        <circle
                            cx={p.x} cy={p.y} r={hovered === i ? 5 : 3}
                            fill={hovered === i ? color : "#ffffff"}
                            stroke={color} strokeWidth="2"
                            style={{ cursor: "pointer", transition: "r 0.15s" }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        />
                        {hovered === i && (
                            <g>
                                <rect x={p.x - 20} y={p.y - 28} width="40" height="20" rx="4" fill={color} />
                                <text x={p.x} y={p.y - 14} fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">
                                    {p.value}
                                </text>
                            </g>
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
}
