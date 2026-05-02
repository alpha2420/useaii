"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Shield, Trash2, Search, RefreshCw, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface User {
    _id: string;
    email: string;
    name: string;
    credits: number;
    isActive: boolean;
    role: string;
    createdAt: string;
}

const ROLES = ["owner", "admin", "agent", "viewer"];

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => { fetchUsers(); }, []);

    async function fetchUsers() {
        setRefreshing(true);
        const res = await fetch("/api/admin/users");
        if (res.status === 403) { router.push("/admin-portal"); return; }
        const data = await res.json();
        setUsers(data);
        setLoading(false);
        setRefreshing(false);
    }

    async function updateUser(userId: string, updates: any) {
        await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId, ...updates })
        });
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...updates } : u));
    }

    async function deleteUser(userId: string) {
        const res = await fetch("/api/admin/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId })
        });
        if (res.ok) {
            setUsers(prev => prev.filter(u => u._id !== userId));
            setConfirmDelete(null);
        }
    }

    const filtered = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase())
    );

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
                        <Users className="w-3.5 h-3.5" />
                        User Management
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">All Users</h1>
                    <p className="text-slate-500 text-sm mt-1">Create, edit, suspend, or delete any platform user.</p>
                </div>
                <button onClick={fetchUsers} disabled={refreshing} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Total Users",    value: users.length,                          color: "text-slate-900" },
                    { label: "Active",         value: users.filter(u => u.isActive).length,  color: "text-emerald-600" },
                    { label: "Suspended",      value: users.filter(u => !u.isActive).length, color: "text-red-500" },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
                        <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 text-xs uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-3 font-medium">User</th>
                            <th className="px-6 py-3 font-medium">Role</th>
                            <th className="px-6 py-3 font-medium">Credits</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Joined</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((user, i) => (
                            <motion.tr key={user._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
                                            <div className="text-xs text-slate-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="relative inline-block">
                                        <select
                                            value={user.role}
                                            onChange={e => updateUser(user._id, { role: e.target.value })}
                                            className="appearance-none bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-violet-500 pointer-events-none" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-mono text-slate-700">{(user.credits || 0).toLocaleString()}</span>
                                        <button
                                            onClick={() => { const n = prompt("Add credits:", "50000"); if (n) updateUser(user._id, { credits: (user.credits || 0) + parseInt(n) }); }}
                                            className="text-[10px] bg-violet-50 hover:bg-violet-100 text-violet-600 px-2 py-1 rounded-lg font-semibold transition-all"
                                        >+ Add</button>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${user.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                        {user.isActive ? "Active" : "Suspended"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setConfirmDelete(user._id)}
                                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete user"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-2">Delete User?</h2>
                        <p className="text-slate-500 text-sm mb-6">This action is permanent and cannot be undone. The user and all their data will be removed.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all">Cancel</button>
                            <button onClick={() => deleteUser(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
