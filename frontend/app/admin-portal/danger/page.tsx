"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Trash2, LogOut, MessageSquare, Users } from "lucide-react";
import { motion } from "framer-motion";

interface DangerAction {
    id: string;
    label: string;
    description: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
    needsUser: boolean;
}

const ACTIONS: DangerAction[] = [
    {
        id: "DELETE_USER",
        label: "Delete a User Permanently",
        description: "Permanently delete a user account and all their associated data. This cannot be undone.",
        icon: Trash2,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        needsUser: true,
    },
    {
        id: "WIPE_USER_CONVERSATIONS",
        label: "Wipe User's Conversations",
        description: "Delete all conversation history for a specific user. The user account remains active.",
        icon: MessageSquare,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        needsUser: true,
    },
    {
        id: "FORCE_LOGOUT_ALL",
        label: "Force Logout All Users",
        description: "Invalidate all active sessions platform-wide. Every user will be forced to log in again.",
        icon: LogOut,
        color: "text-slate-700",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        needsUser: false,
    },
];

export default function DangerZonePage() {
    const [users, setUsers] = useState<{ _id: string; name: string; email: string }[]>([]);
    const [modal, setModal] = useState<DangerAction | null>(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    useEffect(() => {
        fetch("/api/admin/users").then(r => r.json()).then(data => {
            setUsers(Array.isArray(data) ? data.map((u: any) => ({ _id: u._id, name: u.name, email: u.email })) : []);
        });
    }, []);

    async function execute() {
        if (confirmation !== "I understand") return;
        setLoading(true);
        const body: any = { action: modal!.id, confirmation };
        if (modal!.needsUser) body.targetUserId = selectedUser;

        const res = await fetch("/api/admin/danger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        setResult(data.result || data.message || "Action completed.");
        setLoading(false);
        setConfirmation("");
    }

    function closeModal() {
        setModal(null);
        setSelectedUser("");
        setConfirmation("");
        setResult("");
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-red-600 font-semibold text-xs uppercase tracking-widest mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Danger Zone
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Irreversible Actions</h1>
                <p className="text-slate-500 text-sm mt-1">These actions are permanent and cannot be undone. Proceed with extreme caution.</p>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                    <div className="font-bold text-red-800">Super Admin Access Required</div>
                    <div className="text-sm text-red-700 mt-1">All actions below require a typed confirmation ("I understand") and are permanently logged to the Audit Log. There is no undo.</div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="space-y-4">
                {ACTIONS.map((action, i) => (
                    <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`bg-white border ${action.borderColor} rounded-2xl p-6 shadow-sm flex items-center justify-between gap-6`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${action.bgColor} flex-shrink-0`}>
                                <action.icon className={`w-5 h-5 ${action.color}`} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{action.label}</div>
                                <div className="text-sm text-slate-400 mt-0.5 max-w-md">{action.description}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setModal(action)}
                            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${action.id === "DELETE_USER" || action.id === "WIPE_USER_CONVERSATIONS"
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            Execute
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-xl ${modal.bgColor}`}>
                                <modal.icon className={`w-6 h-6 ${modal.color}`} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">{modal.label}</h2>
                                <p className="text-sm text-slate-400">This action cannot be undone</p>
                            </div>
                        </div>

                        {result ? (
                            <div>
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700 mb-6">{result}</div>
                                <button onClick={closeModal} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all">Done</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {modal.needsUser && (
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">Select User</label>
                                        <select
                                            value={selectedUser}
                                            onChange={e => setSelectedUser(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                        >
                                            <option value="">— Select a user —</option>
                                            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">
                                        Type <span className="text-red-600 font-bold">I understand</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmation}
                                        onChange={e => setConfirmation(e.target.value)}
                                        placeholder="I understand"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={closeModal} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all">Cancel</button>
                                    <button
                                        onClick={execute}
                                        disabled={loading || confirmation !== "I understand" || (modal.needsUser && !selectedUser)}
                                        className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all"
                                    >
                                        {loading ? "Executing..." : "Confirm & Execute"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
