export function DonutChart({
    segments,
    size = 120,
    label,
    value,
}: {
    segments: { value: number; color: string; label: string }[];
    size?: number;
    label: string;
    value: string | number;
}) {
    const total = segments.reduce((a, b) => a + b.value, 0) || 1;
    const r = 40;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
 
    const arcs = segments.map((seg) => {
        const pct = seg.value / total;
        const dash = pct * circumference;
        const arc = { dash, offset, color: seg.color, label: seg.label, value: seg.value };
        offset += dash;
        return arc;
    });
 
    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f4f4f5" strokeWidth="14" />
                    {arcs.map((arc, i) => (
                        <circle
                            key={i}
                            cx={cx} cy={cy} r={r}
                            fill="none"
                            stroke={arc.color}
                            strokeWidth="14"
                            strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
                            strokeDashoffset={-arc.offset}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dasharray 0.6s ease" }}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-zinc-900">{value}</span>
                    <span className="text-xs text-zinc-500 font-medium">{label}</span>
                </div>
            </div>
        </div>
    );
}
