export function ProgressBar({
    label, value, total, color, icon,
}: {
    label: string; value: number; total: number; color: string; icon?: string;
}) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="group">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-zinc-700 capitalize font-medium flex items-center gap-1.5">
                    {icon && <span>{icon}</span>}{label}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900">{value}</span>
                    <span className="text-xs text-zinc-400 font-medium w-8 text-right">{pct}%</span>
                </div>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
        </div>
    );
}
