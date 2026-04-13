"use client";
 
import { useEffect, useState } from "react";
 
const EXAMPLES = [
    {
        label: "Always upsell",
        value: "Always try to upsell customers to a premium package before ending the conversation. Mention that the premium plan includes priority support and faster delivery.",
    },
    {
        label: "Collect lead info",
        value: "Always ask for the customer's name and phone number before answering questions about pricing. Say: 'I'd love to help! May I have your name and contact number so our team can assist you better?'",
    },
    {
        label: "Hindi responses",
        value: "If the customer writes in Hindi or uses Hinglish, always respond in Hindi. Keep the tone warm and friendly.",
    },
    {
        label: "Urgent escalation",
        value: "If a customer mentions 'urgent', 'emergency', 'complaint', or says they are angry, immediately tell them that a human agent will contact them within 30 minutes and stop trying to answer yourself.",
    },
    {
        label: "Appointment booking",
        value: "When a customer wants to book a service, ask for: 1) Their preferred date and time 2) Their full name 3) Their address. Then confirm by saying 'Our team will confirm your appointment within 2 hours.'",
    },
];
 
export default function AgentInstructionsPage() {
    const [instructions, setInstructions] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
 
    useEffect(() => { fetchInstructions(); }, []);
 
    async function fetchInstructions() {
        try {
            const res = await fetch("/api/agent-instructions");
            const data = await res.json();
            setInstructions(data.agentInstructions || "");
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }
 
    async function save() {
        setSaving(true);
        setSaved(false);
        try {
            await fetch("/api/agent-instructions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agentInstructions: instructions }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    }
 
    function applyExample(value: string) {
        setInstructions((prev) => (prev ? prev + "\n\n" + value : value));
    }
 
    const charCount = instructions.length;
    const maxChars = 2000;
 
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
 
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agent Instructions</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Program exactly how your AI behaves — it will follow these rules on every WhatsApp conversation.
                    </p>
                </div>
 
                {/* How it works */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
                    <p className="font-semibold mb-1">How this works</p>
                    <p className="text-indigo-700 leading-relaxed">
                        These instructions are injected directly into your AI's prompt before every customer reply.
                        Think of it as giving your AI employee a training manual — it will follow your rules strictly.
                        Your business knowledge stays separate and is always included.
                    </p>
                </div>
 
                {/* Examples */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Quick examples — click to add:</p>
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLES.map((ex) => (
                            <button
                                key={ex.label}
                                onClick={() => applyExample(ex.value)}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
                            >
                                + {ex.label}
                            </button>
                        ))}
                    </div>
                </div>
 
                {/* Text area */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Your Instructions
                        </span>
                        <span className={`text-xs ${charCount > maxChars * 0.9 ? "text-red-500" : "text-gray-400"}`}>
                            {charCount} / {maxChars}
                        </span>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center text-gray-300 text-sm">Loading...</div>
                    ) : (
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            maxLength={maxChars}
                            rows={14}
                            placeholder={`Write your custom instructions here. For example:\n\n- Always greet customers by name if they share it\n- Never reveal our supplier names\n- If asked about delivery, always quote 3-5 working days\n- When a customer asks for a discount, offer 5% and say it's a special offer just for them`}
                            className="w-full px-4 py-4 text-sm text-gray-800 resize-none focus:outline-none leading-relaxed"
                        />
                    )}
                </div>
 
                {/* Rules preview */}
                {instructions.trim() && (
                    <div className="bg-gray-900 rounded-xl p-4 text-xs text-gray-300 font-mono">
                        <p className="text-gray-500 mb-2">// Preview — how this gets sent to the AI:</p>
                        <p className="text-green-400">SPECIAL INSTRUCTIONS FROM THE BUSINESS OWNER:</p>
                        <p className="text-gray-300 mt-1 whitespace-pre-wrap leading-relaxed">
                            {instructions.slice(0, 300)}{instructions.length > 300 ? "..." : ""}
                        </p>
                    </div>
                )}
 
                {/* Save button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={save}
                        disabled={saving || charCount > maxChars}
                        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {saving ? "Saving..." : "Save Instructions"}
                    </button>
                    {saved && (
                        <span className="text-sm text-green-600 font-medium">
                             Saved — AI will use these from the next message
                        </span>
                    )}
                    {instructions && (
                        <button
                            onClick={() => setInstructions("")}
                            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
 
                {/* Role note */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800">
                    <p className="font-semibold mb-1"> Access Control</p>
                    <p>Only <strong>Owner</strong> and <strong>Admin</strong> roles can edit agent instructions. Agents and Viewers can read but not modify.</p>
                </div>
            </div>
        </div>
    );
}
