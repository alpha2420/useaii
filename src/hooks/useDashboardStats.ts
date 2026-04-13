"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardStats } from "@/types/analytics";

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            // Reset error if manual refresh
            if (!stats) setLoading(true);
            setError(null);
            
            const res = await fetch("/api/dashboard/stats");
            const data = await res.json();
            
            if ("message" in data && res.status >= 400) {
                setError(data.message || "Unknown server error");
            } else {
                setStats(data);
                setLastUpdated(new Date());
            }
        } catch (e: any) {
            console.error("Error fetching stats:", e);
            setError(e.message || "Failed to fetch dashboard stats");
        } finally {
            setLoading(false);
        }
    }, [stats]);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 60000); // 60s poll
        return () => clearInterval(interval);
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        lastUpdated,
        refetch: fetchStats,
    };
}
