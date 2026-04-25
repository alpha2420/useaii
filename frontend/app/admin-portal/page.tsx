"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Users, 
    Cpu, 
    BarChart3, 
    Activity, 
    ShieldCheck, 
    CreditCard, 
    ChevronRight,
    Search,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Stats {
    totalUsers: number;
    totalTokens: number;
    totalRequests: number;
    promptTokens: number;
    completionTokens: number;
}

interface User {
    _id: string;
    email: string;
    name: string;
    credits: number;
    isActive: boolean;
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

    useEffect(() => {
        fetchData();
    }, []);

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
        try {
            await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId: userId, credits: newCredits })
            });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, credits: newCredits } : u));
        } catch (e) {
            alert("Failed to update credits");
        }
    }

    async function toggleUserStatus(userId: string, currentStatus: boolean) {
        try {
            await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId: userId, isActive: !currentStatus })
            });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
        } catch (e) {
            alert("Failed to update status");
        }
    }

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-zinc-400 mb-8 max-w-md">{error}</p>
                <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-widest text-xs uppercase mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        Super Admin Portal
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Platform Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchData} 
                        disabled={refreshing}
                        className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                        Go to Dashboard
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Total Tokens", value: (stats?.totalTokens || 0).toLocaleString(), icon: Cpu, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "AI Requests", value: (stats?.totalRequests || 0).toLocaleString(), icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/10" },
                    { label: "Estimated Cost", value: `$${((stats?.totalTokens || 0) * 0.000002).toFixed(2)}`, icon: CreditCard, color: "text-orange-400", bg: "bg-orange-400/10" },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Live</div>
                        </div>
                        <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                        <div className="text-zinc-500 text-sm mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Users List (2/3 width) */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <Users className="w-5 h-5 text-indigo-400" />
                                Registered Users
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search users..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-zinc-500 text-xs uppercase tracking-widest bg-zinc-900/30">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Credits Remaining</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{user.name}</div>
                                                <div className="text-xs text-zinc-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm font-mono text-indigo-300">{(user.credits || 0).toLocaleString()}</div>
                                                    <button 
                                                        onClick={() => {
                                                            const n = prompt("Add credits (number):", "50000");
                                                            if (n) updateUserCredits(user._id, (user.credits || 0) + parseInt(n));
                                                        }}
                                                        className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 transition-all"
                                                    >
                                                        + Add
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {user.isActive ? "Active" : "Suspended"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                    className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${user.isActive ? 'text-red-400 hover:bg-red-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                                                >
                                                    {user.isActive ? "Suspend" : "Activate"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (1/3 width) */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Activity className="w-40 h-40" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Master Controls</h3>
                        <p className="text-indigo-100 text-sm mb-6">Global system management for Converra AI.</p>
                        <div className="space-y-3">
                            <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-between transition-all">
                                Platform Configuration
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-between transition-all">
                                Global API Settings
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-between transition-all">
                                Billing Logs
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">System Integrity</h4>
                        <div className="space-y-4">
                            {[
                                { name: "WhatsApp Gateway", status: "Operational", color: "text-emerald-500" },
                                { name: "Gemini 1.5 Flash", status: "Operational", color: "text-emerald-500" },
                                { name: "Vector Engine", status: "Operational", color: "text-emerald-500" },
                                { name: "Database Cluster", status: "Operational", color: "text-emerald-500" },
                            ].map((s) => (
                                <div key={s.name} className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                                    <span className="text-sm text-zinc-300">{s.name}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${s.color}`}>{s.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
