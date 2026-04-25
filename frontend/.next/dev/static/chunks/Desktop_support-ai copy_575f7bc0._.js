(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CRMChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const STAGES = [
    "new",
    "contacted",
    "interested",
    "negotiating",
    "won",
    "lost"
];
const LEAD_DOT = {
    hot: "bg-red-500",
    warm: "bg-amber-400",
    cold: "bg-sky-400"
};
const LEAD_BADGE = {
    hot: "bg-red-50 text-red-700 border border-red-200",
    warm: "bg-amber-50 text-amber-700 border border-amber-200",
    cold: "bg-sky-50 text-sky-700 border border-sky-200"
};
function displayName(c) {
    return c.extractedName || c.contactName || c.contactNumber.replace("@c.us", "");
}
function formatTime(iso) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
    });
}
function formatMsgTime(iso) {
    return new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}
function formatDate(iso) {
    return new Date(iso).toLocaleDateString([], {
        month: "short",
        day: "numeric"
    });
}
// ── Correction Modal ──────────────────────────────────────────────────────────
function CorrectionModal({ question, badReply, onSave, onClose }) {
    _s();
    const [val, setVal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 w-full max-w-lg",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-base font-bold text-zinc-900 mb-1",
                    children: "Correct this reply"
                }, void 0, false, {
                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                    lineNumber: 90,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-zinc-400 mb-5",
                    children: "The AI will remember this and never make this mistake again."
                }, void 0, false, {
                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                    lineNumber: 91,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1",
                            children: "Customer asked"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl p-3",
                            children: question
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 94,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                    lineNumber: 92,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-semibold text-red-500 uppercase tracking-widest mb-1",
                            children: "❌ AI said (wrong)"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 97,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-red-900 bg-red-50 border border-red-200 rounded-xl p-3 line-through opacity-70",
                            children: badReply
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 98,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                    lineNumber: 96,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mb-1",
                            children: "✅ Correct answer"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 101,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: val,
                            onChange: (e)=>setVal(e.target.value),
                            placeholder: "Type the correct response...",
                            rows: 3,
                            className: "w-full border border-zinc-300 rounded-xl px-3 py-2.5 text-sm text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400/50",
                            autoFocus: true
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 102,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                    lineNumber: 100,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: async ()=>{
                                if (!val.trim()) return;
                                setSaving(true);
                                await onSave(val.trim());
                                setSaving(false);
                            },
                            disabled: saving || !val.trim(),
                            className: "flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 transition-all",
                            children: saving ? "Saving..." : "Save & Teach AI"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 106,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-5 py-2.5 rounded-xl text-sm text-zinc-600 border border-zinc-200 hover:bg-zinc-50 transition-all",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 111,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                    lineNumber: 105,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
            lineNumber: 89,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
        lineNumber: 88,
        columnNumber: 9
    }, this);
}
_s(CorrectionModal, "UQ3Yk0adNOCK4DLpSiEaJa/WYj4=");
_c = CorrectionModal;
function CRMChatPage() {
    _s1();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const activeContact = searchParams.get("contact") || "";
    const [contacts, setContacts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [contact, setContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingList, setLoadingList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingChat, setLoadingChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [savingNotes, setSavingNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [togglingAi, setTogglingAi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [correctionTarget, setCorrectionTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [correctionSuccess, setCorrectionSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Fetch contact list
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CRMChatPage.useEffect": ()=>{
            fetch("/api/crm").then({
                "CRMChatPage.useEffect": (r)=>r.json()
            }["CRMChatPage.useEffect"]).then({
                "CRMChatPage.useEffect": (d)=>setContacts(d.contacts || [])
            }["CRMChatPage.useEffect"]).catch(console.error).finally({
                "CRMChatPage.useEffect": ()=>setLoadingList(false)
            }["CRMChatPage.useEffect"]);
        }
    }["CRMChatPage.useEffect"], []);
    // Auto-refresh list every 15s
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CRMChatPage.useEffect": ()=>{
            const t = setInterval({
                "CRMChatPage.useEffect.t": ()=>{
                    fetch("/api/crm").then({
                        "CRMChatPage.useEffect.t": (r)=>r.json()
                    }["CRMChatPage.useEffect.t"]).then({
                        "CRMChatPage.useEffect.t": (d)=>setContacts(d.contacts || [])
                    }["CRMChatPage.useEffect.t"]).catch({
                        "CRMChatPage.useEffect.t": ()=>{}
                    }["CRMChatPage.useEffect.t"]);
                }
            }["CRMChatPage.useEffect.t"], 15000);
            return ({
                "CRMChatPage.useEffect": ()=>clearInterval(t)
            })["CRMChatPage.useEffect"];
        }
    }["CRMChatPage.useEffect"], []);
    // Fetch single conversation
    const fetchConversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CRMChatPage.useCallback[fetchConversation]": async (num)=>{
            setLoadingChat(true);
            try {
                const res = await fetch(`/api/crm?contactNumber=${encodeURIComponent(num)}`);
                const data = await res.json();
                setContact(data);
                setNotes(data.notes || "");
            } catch (e) {
                console.error(e);
            } finally{
                setLoadingChat(false);
            }
        }
    }["CRMChatPage.useCallback[fetchConversation]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CRMChatPage.useEffect": ()=>{
            if (activeContact) fetchConversation(activeContact);
        }
    }["CRMChatPage.useEffect"], [
        activeContact,
        fetchConversation
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CRMChatPage.useEffect": ()=>{
            bottomRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["CRMChatPage.useEffect"], [
        contact?.messages
    ]);
    async function sendMessage() {
        if (!message.trim() || sending || !activeContact) return;
        setSending(true);
        try {
            await fetch("/api/crm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactNumber: activeContact,
                    text: message.trim()
                })
            });
            setContact((prev)=>prev ? {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        {
                            role: "owner",
                            text: message.trim(),
                            timestamp: new Date().toISOString()
                        }
                    ]
                } : prev);
            setMessage("");
        } finally{
            setSending(false);
        }
    }
    async function saveNotes() {
        setSavingNotes(true);
        try {
            await fetch("/api/crm", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactNumber: activeContact,
                    notes
                })
            });
        } finally{
            setSavingNotes(false);
        }
    }
    async function toggleAi() {
        if (!contact) return;
        setTogglingAi(true);
        try {
            const res = await fetch("/api/crm", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactNumber: activeContact,
                    isAiPaused: !contact.isAiPaused
                })
            });
            const updated = await res.json();
            setContact((prev)=>prev ? {
                    ...prev,
                    isAiPaused: updated.isAiPaused
                } : prev);
            setContacts((prev)=>prev.map((c)=>c.contactNumber === activeContact ? {
                        ...c,
                        isAiPaused: updated.isAiPaused
                    } : c));
        } finally{
            setTogglingAi(false);
        }
    }
    async function updateStage(stage) {
        await fetch("/api/crm", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contactNumber: activeContact,
                stage
            })
        });
        setContact((prev)=>prev ? {
                ...prev,
                stage
            } : prev);
    }
    async function handleSaveCorrection(correctReply) {
        if (!correctionTarget) return;
        await fetch("/api/corrections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contactNumber: activeContact,
                originalQuestion: correctionTarget.question,
                badReply: correctionTarget.badReply,
                correctReply
            })
        });
        setCorrectionTarget(null);
        setCorrectionSuccess(true);
        setTimeout(()=>setCorrectionSuccess(false), 3000);
    }
    function findQuestion(msgs, botIdx) {
        for(let i = botIdx - 1; i >= 0; i--){
            if (msgs[i].role === "customer") return msgs[i].text;
        }
        return "Unknown question";
    }
    const filtered = contacts.filter((c)=>{
        if (!search) return true;
        const q = search.toLowerCase();
        return displayName(c).toLowerCase().includes(q) || c.contactNumber.includes(q);
    });
    // Group messages by date
    const grouped = [];
    (contact?.messages || []).forEach((msg, idx)=>{
        const date = formatDate(msg.timestamp);
        const last = grouped[grouped.length - 1];
        if (last && last.date === date) last.msgs.push({
            msg,
            idx
        });
        else grouped.push({
            date,
            msgs: [
                {
                    msg,
                    idx
                }
            ]
        });
    });
    const MSG_STYLE = {
        customer: "bg-white border border-zinc-200 text-zinc-800 self-start rounded-2xl rounded-tl-sm shadow-sm",
        bot: "bg-indigo-50 border border-indigo-100 text-indigo-900 self-end rounded-2xl rounded-tr-sm",
        owner: "bg-emerald-500 text-white self-end rounded-2xl rounded-tr-sm shadow-md"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen flex flex-col bg-zinc-100 overflow-hidden",
        children: [
            correctionSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-pulse",
                children: "✓ AI correction saved!"
            }, void 0, false, {
                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                lineNumber: 271,
                columnNumber: 17
            }, this),
            correctionTarget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CorrectionModal, {
                question: correctionTarget.question,
                badReply: correctionTarget.badReply,
                onSave: handleSaveCorrection,
                onClose: ()=>setCorrectionTarget(null)
            }, void 0, false, {
                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                lineNumber: 276,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-b border-zinc-200 px-4 h-14 flex items-center justify-between flex-shrink-0 shadow-sm z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/dashboard/crm"),
                                className: "flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-sm font-medium transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "←"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 25
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Back"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 40
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 283,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-px h-5 bg-zinc-200"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 286,
                                columnNumber: 21
                            }, this),
                            contact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold",
                                        children: displayName(contact).charAt(0).toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 289,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-zinc-900 leading-tight",
                                                children: displayName(contact)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                lineNumber: 293,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-zinc-400",
                                                        children: contact.contactNumber.replace("@c.us", "")
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 37
                                                    }, this),
                                                    contact.enriched?.language && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-zinc-400",
                                                        children: [
                                                            "· 🌐 ",
                                                            contact.enriched.language
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 68
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                lineNumber: 294,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 292,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 288,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-400",
                                children: "Select a conversation"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 301,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                        lineNumber: 282,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: contact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: contact.stage,
                                    onChange: (e)=>updateStage(e.target.value),
                                    className: "text-xs border border-zinc-200 rounded-lg px-2 py-1.5 bg-zinc-50 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 capitalize cursor-pointer",
                                    children: STAGES.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: s,
                                            children: s
                                        }, s, false, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 309,
                                            columnNumber: 50
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleAi,
                                    disabled: togglingAi,
                                    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${contact.isAiPaused ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"}`,
                                    children: contact.isAiPaused ? "▶ Resume AI" : "⏸ Pause AI"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 311,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                        lineNumber: 304,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                lineNumber: 281,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-80 bg-white border-r border-zinc-200 flex flex-col flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 border-b border-zinc-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: search,
                                    onChange: (e)=>setSearch(e.target.value),
                                    placeholder: "Search contacts...",
                                    className: "w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition placeholder:text-zinc-400"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 330,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 329,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto",
                                children: loadingList ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center py-16",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 337,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 336,
                                    columnNumber: 29
                                }, this) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center text-zinc-400 text-xs py-12",
                                    children: "No contacts found"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 340,
                                    columnNumber: 29
                                }, this) : filtered.map((c)=>{
                                    const isActive = c.contactNumber === activeContact;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push(`/dashboard/crm/chat?contact=${encodeURIComponent(c.contactNumber)}`),
                                        className: `w-full text-left px-4 py-3.5 border-b border-zinc-100 transition-all flex items-start gap-3 ${isActive ? "bg-indigo-50 border-l-2 border-l-indigo-500" : "hover:bg-zinc-50"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative flex-shrink-0 mt-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-center justify-center text-white text-sm font-bold",
                                                        children: displayName(c).charAt(0).toUpperCase()
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${LEAD_DOT[c.leadScore]}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-0.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-sm font-medium truncate ${isActive ? "text-indigo-700" : "text-zinc-900"}`,
                                                                children: displayName(c)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-zinc-400 flex-shrink-0 ml-2",
                                                                children: formatTime(c.lastMessageAt)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 359,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${LEAD_BADGE[c.leadScore]}`,
                                                                children: c.leadScore
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 49
                                                            }, this),
                                                            c.isAiPaused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded font-medium",
                                                                children: "Manual"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 363,
                                                                columnNumber: 66
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 45
                                                    }, this),
                                                    c.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] text-zinc-400 truncate mt-0.5 leading-snug",
                                                        children: c.summary
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 59
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                lineNumber: 354,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, c._id, true, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 345,
                                        columnNumber: 37
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 334,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                        lineNumber: 328,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col min-w-0",
                        style: {
                            backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                            backgroundColor: "#f3f4f6"
                        },
                        children: !activeContact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex flex-col items-center justify-center text-zinc-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-5xl mb-4",
                                    children: "💬"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 379,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium",
                                    children: "Select a conversation to begin"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 380,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 378,
                            columnNumber: 25
                        }, this) : loadingChat ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 384,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                            lineNumber: 383,
                            columnNumber: 25
                        }, this) : contact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                contact.isAiPaused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-orange-50 border-b border-orange-200 px-6 py-2 text-xs text-orange-600 text-center font-medium flex-shrink-0",
                                    children: "⏸ AI auto-reply paused — you are in manual control"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 390,
                                    columnNumber: 33
                                }, this),
                                (contact.extractedName || contact.enriched?.location || contact.extractedBudget) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-indigo-50/80 border-b border-indigo-100 px-6 py-2 text-xs text-indigo-700 flex items-center gap-4 flex-shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: "🧠 AI Memory:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 37
                                        }, this),
                                        contact.extractedName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "Name: ",
                                                contact.extractedName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 398,
                                            columnNumber: 63
                                        }, this),
                                        contact.enriched?.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "📍 ",
                                                contact.enriched.location
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 399,
                                            columnNumber: 68
                                        }, this),
                                        contact.extractedBudget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "💰 ",
                                                contact.extractedBudget
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 400,
                                            columnNumber: 65
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 396,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-y-auto px-6 py-4 space-y-5",
                                    children: [
                                        grouped.map(({ date, msgs })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 my-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 h-px bg-zinc-300/60"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[11px] text-zinc-400 bg-white/70 backdrop-blur-sm border border-zinc-200 rounded-full px-3 py-0.5 font-medium",
                                                                children: date
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 409,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 h-px bg-zinc-300/60"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 407,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col gap-2",
                                                        children: msgs.map(({ msg, idx })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `flex flex-col max-w-xs group ${msg.role !== "customer" ? "self-end items-end" : "self-start items-start"}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] text-zinc-400 mb-1 px-1",
                                                                        children: msg.role === "customer" ? "Customer" : msg.role === "bot" ? "AI Bot" : "You"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                        lineNumber: 416,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `px-4 py-2.5 text-sm leading-relaxed ${MSG_STYLE[msg.role]}`,
                                                                        children: msg.text
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                        lineNumber: 419,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mt-1 px-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-zinc-400",
                                                                                children: formatMsgTime(msg.timestamp)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                                lineNumber: 423,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            msg.role === "bot" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setCorrectionTarget({
                                                                                        question: findQuestion(contact.messages, idx),
                                                                                        badReply: msg.text,
                                                                                        msgIndex: idx
                                                                                    }),
                                                                                className: "text-[10px] text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all",
                                                                                children: "✏️ Correct"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                                lineNumber: 425,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                        lineNumber: 422,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                                lineNumber: 414,
                                                                columnNumber: 49
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 412,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, date, true, {
                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                lineNumber: 406,
                                                columnNumber: 37
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: bottomRef
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 437,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 404,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white/90 backdrop-blur-sm border-t border-zinc-200 px-4 py-3 flex-shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 items-end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: message,
                                                    onChange: (e)=>setMessage(e.target.value),
                                                    onKeyDown: (e)=>{
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            sendMessage();
                                                        }
                                                    },
                                                    placeholder: "Type a message to send via WhatsApp...",
                                                    rows: 1,
                                                    className: "flex-1 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm bg-white text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-zinc-400 shadow-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: sendMessage,
                                                    disabled: sending || !message.trim(),
                                                    className: "px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 transition-all shadow-sm flex-shrink-0",
                                                    children: sending ? "..." : "Send"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 441,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-zinc-400 mt-1.5",
                                            children: "Enter to send · Shift+Enter for new line"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                            lineNumber: 452,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                    lineNumber: 440,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true) : null
                    }, void 0, false, {
                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                        lineNumber: 375,
                        columnNumber: 17
                    }, this),
                    contact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-72 bg-white border-l border-zinc-200 flex flex-col overflow-y-auto flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-5 border-b border-zinc-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3",
                                        children: "Contact Intel"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 463,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            {
                                                label: "Lead",
                                                value: contact.leadScore
                                            },
                                            {
                                                label: "Budget",
                                                value: contact.extractedBudget
                                            },
                                            {
                                                label: "Company",
                                                value: contact.enriched?.company
                                            },
                                            {
                                                label: "Location",
                                                value: contact.enriched?.location
                                            },
                                            {
                                                label: "Email",
                                                value: contact.enriched?.email
                                            }
                                        ].filter((r)=>r.value).map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-zinc-500",
                                                        children: r.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 473,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs font-semibold ${r.label === "Lead" ? LEAD_BADGE[contact.leadScore] + " px-2 py-0.5 rounded-md" : "text-zinc-900"}`,
                                                        children: r.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                        lineNumber: 474,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, r.label, true, {
                                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                                lineNumber: 472,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 464,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 462,
                                columnNumber: 25
                            }, this),
                            contact.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-5 border-b border-zinc-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2",
                                        children: "AI Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 484,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-xl p-3 leading-relaxed",
                                        children: contact.summary
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 485,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 483,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2",
                                        children: "Private Notes"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 490,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: notes,
                                        onChange: (e)=>setNotes(e.target.value),
                                        placeholder: "Add private notes...",
                                        rows: 5,
                                        className: "w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-xs bg-white text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 placeholder:text-zinc-400 shadow-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 491,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: saveNotes,
                                        disabled: savingNotes,
                                        className: "mt-2 w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium py-2 rounded-lg transition-all",
                                        children: savingNotes ? "Saving..." : "Save Notes"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                        lineNumber: 495,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                                lineNumber: 489,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                        lineNumber: 460,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
                lineNumber: 325,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/support-ai copy/frontend/app/dashboard/crm/chat/page.tsx",
        lineNumber: 268,
        columnNumber: 9
    }, this);
}
_s1(CRMChatPage, "ksUBfB0j9A7/OoyFHYOQXW+Sf1s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = CRMChatPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "CorrectionModal");
__turbopack_context__.k.register(_c1, "CRMChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/support-ai copy/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/Desktop/support-ai copy/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/Desktop/support-ai copy/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/Desktop/support-ai copy/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/Desktop/support-ai copy/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/Desktop/support-ai copy/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Desktop_support-ai%20copy_575f7bc0._.js.map