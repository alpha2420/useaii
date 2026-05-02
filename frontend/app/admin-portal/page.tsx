"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users, Cpu, BarChart3, Activity, ShieldCheck,
    CreditCard, Search, RefreshCw, TrendingUp,
    TrendingDown, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
    totalUsers: number;
    totalTokens: number;
    totalRequests: number;
}

interface User {
    _id: string;
    email: string;
    name: string;
    credits: number;
    isActive: boolean;
    role: string;
    createdAt: string;
}

export default function AdminPortal() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        setRefreshing(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/users")
            ]);
            if (statsRes.status === 403 || usersRes.status === 403) {
                setError("You do not have Super Admin privileges.");
                return;
            }
            const statsData = await statsRes.json();
            const usersData = await usersRes.json();
            setStats(statsData.stats);
            setUsers(usersData);
        } catch (e) {
            setError("Failed to load admin data.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    async function updateUserCredits(userId: string, newCredits: number) {
        await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId, credits: newCredits })
        });
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, credits: newCredits } : u));
    }

    async function toggleUserStatus(userId: string, currentStatus: boolean) {
        await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId, isActive: !currentStatus })
        });
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
    }

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <button onClick={() => router.push("/dashboard")} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-all">Back to Dashboard</button>
        </div>
    );

    const statCards = [
        { label: "Total Users",     value: stats?.totalUsers ?? 0,                                       icon: Users,    color: "text-violet-600", bg: "bg-violet-50",  border: "border-violet-100" },
        { label: "Total Tokens",    value: (stats?.totalTokens ?? 0).toLocaleString(),                   icon: Cpu,      color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-100" },
        { label: "AI Requests",     value: (stats?.totalRequests ?? 0).toLocaleString(),                 icon: BarChart3,color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Estimated Cost",  value: `$${((stats?.totalTokens ?? 0) * 0.000002).toFixed(2)}`,      icon: CreditCard,color: "text-orange-600",bg: "bg-orange-50", border: "border-orange-100" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Super Admin Portal
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Full visibility and control over all platform activity.</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`bg-white border ${s.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${s.bg}`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                        <div className="text-slate-500 text-sm mt-0.5">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Nav Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Analytics",      href: "/admin-portal/analytics", color: "bg-violet-600 hover:bg-violet-700", icon: BarChart3 },
                    { label: "User Mgmt",      href: "/admin-portal/users",     color: "bg-blue-600 hover:bg-blue-700",   icon: Users },
                    { label: "System Health",  href: "/admin-portal/health",    color: "bg-emerald-600 hover:bg-emerald-700", icon: Activity },
                    { label: "Feature Flags",  href: "/admin-portal/flags",     color: "bg-orange-500 hover:bg-orange-600", icon: TrendingUp },
                ].map(item => (
                    <button
                        key={item.href}
                        onClick={() => router.push(item.href)}
                        className={`${item.color} text-white rounded-2xl p-5 flex flex-col items-start gap-3 transition-all shadow-sm hover:shadow-md`}
                    >
                        <item.icon className="w-5 h-5 opacity-90" />
                        <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-violet-600" />
                        Registered Users
                        <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">{users.length}</span>
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all w-56"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-xs uppercase tracking-widest bg-slate-50">
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Credits</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
                                                <div className="text-xs text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono text-slate-700">{(user.credits || 0).toLocaleString()}</span>
                                            <button
                                                onClick={() => {
                                                    const n = prompt("Add credits:", "50000");
                                                    if (n) updateUserCredits(user._id, (user.credits || 0) + parseInt(n));
                                                }}
                                                className="text-[10px] bg-violet-50 hover:bg-violet-100 text-violet-600 px-2 py-1 rounded-lg font-semibold transition-all"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                            {user.isActive ? "Active" : "Suspended"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/admin-portal/users`)}
                                                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                                            >
                                                Manage
                                            </button>
                                            <button
                                                onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${user.isActive ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                                            >
                                                {user.isActive ? "Suspend" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
