"use client";

import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, Users, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface UserBilling {
    _id: string;
    name: string;
    email: string;
    credits: number;
    isActive: boolean;
    createdAt: string;
}

interface Summary {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    totalCreditsIssued: number;
}

export default function BillingPage() {
    const [users, setUsers] = useState<UserBilling[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState<string | null>(null);

    useEffect(() => { fetchBilling(); }, []);

    async function fetchBilling() {
        const res = await fetch("/api/admin/billing");
        const data = await res.json();
        setUsers(data.users || []);
        setSummary(data.summary || null);
        setLoading(false);
    }

    async function addCredits(userId: string, currentCredits: number) {
        const n = prompt("Add credits (e.g. 50000):", "50000");
        if (!n || isNaN(parseInt(n))) return;
        setAdding(userId);
        const newTotal = currentCredits + parseInt(n);
        await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId, credits: newTotal })
        });
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, credits: newTotal } : u));
        setAdding(null);
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    Billing & Plans
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Credit Management</h1>
                <p className="text-slate-500 text-sm mt-1">Monitor and manage credits across all platform users.</p>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                    {[
                        { label: "Total Users",     value: summary.totalUsers,                              icon: Users,        color: "text-blue-600",   bg: "bg-blue-50" },
                        { label: "Active",          value: summary.activeUsers,                             icon: TrendingUp,   color: "text-emerald-600",bg: "bg-emerald-50" },
                        { label: "Suspended",       value: summary.suspendedUsers,                          icon: Users,        color: "text-red-500",    bg: "bg-red-50" },
                        { label: "Total Credits",   value: summary.totalCreditsIssued.toLocaleString(),     icon: CreditCard,   color: "text-violet-600", bg: "bg-violet-50" },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                        >
                            <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                            <div className="text-slate-400 text-sm mt-0.5">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Credit Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-violet-600" />
                        Per-User Credits
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-xs uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Credits Remaining</th>
                                <th className="px-6 py-3 font-medium">Joined</th>
                                <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
                                                <div className="text-xs text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                            {user.isActive ? "Active" : "Suspended"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-32">
                                                <div
                                                    className="h-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                                                    style={{ width: `${Math.min((user.credits / 100000) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-mono text-slate-700 font-semibold">{(user.credits || 0).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => addCredits(user._id, user.credits)}
                                            disabled={adding === user._id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl text-xs font-semibold transition-all ml-auto disabled:opacity-50"
                                        >
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            Add Credits
                                        </button>
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
