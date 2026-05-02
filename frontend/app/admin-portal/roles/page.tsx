"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
}

const ROLES = ["owner", "admin", "agent", "viewer"];
const ROLE_COLORS: Record<string, string> = {
    owner:   "bg-violet-50 text-violet-700 border-violet-100",
    admin:   "bg-blue-50 text-blue-700 border-blue-100",
    agent:   "bg-emerald-50 text-emerald-700 border-emerald-100",
    viewer:  "bg-slate-100 text-slate-500 border-slate-200",
};

export default function RolesPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        fetch("/api/admin/users").then(r => r.json()).then(data => {
            setUsers(Array.isArray(data) ? data : []);
            setLoading(false);
        });
    }, []);

    async function changeRole(userId: string, newRole: string) {
        setSaving(userId);
        await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId, role: newRole })
        });
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        setSaving(null);
        setToast("Role updated successfully");
        setTimeout(() => setToast(""), 3000);
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-widest mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    Roles & Permissions
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Role Manager</h1>
                <p className="text-slate-500 text-sm mt-1">Assign or revoke roles for any platform user.</p>
            </div>

            {/* Role Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { role: "owner",  desc: "Full account access" },
                    { role: "admin",  desc: "Manage settings & data" },
                    { role: "agent",  desc: "View conversations only" },
                    { role: "viewer", desc: "Read-only access" },
                ].map(r => (
                    <div key={r.role} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border mb-2 ${ROLE_COLORS[r.role]}`}>
                            {r.role}
                        </span>
                        <p className="text-xs text-slate-400">{r.desc}</p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 text-xs uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-3 font-medium">User</th>
                            <th className="px-6 py-3 font-medium">Current Role</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Change Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user, i) => (
                            <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50 transition-colors">
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
                                    <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${ROLE_COLORS[user.role] || ROLE_COLORS.viewer}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${user.isActive ? "text-emerald-600" : "text-red-500"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                        {user.isActive ? "Active" : "Suspended"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="relative inline-block">
                                        <select
                                            value={user.role}
                                            disabled={saving === user._id}
                                            onChange={e => changeRole(user._id, e.target.value)}
                                            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    {toast}
                </div>
            )}
        </div>
    );
}
