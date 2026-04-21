'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QRCode from 'react-qr-code'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface UnansweredQ {
    _id: string;
    question: string;
    source: "widget" | "whatsapp";
    status: string;
    createdAt: string;
}

function DashboardClient({ ownerId }: { ownerId: string }) {
    const navigate = useRouter()
    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledge, setKnowledge] = useState("")
    const [whatsappNumber, setWhatsappNumber] = useState("")
    const [mediaLinks, setMediaLinks] = useState<{name: string, url: string}[]>([])
    const [newLinkName, setNewLinkName] = useState("")
    const [newLinkUrl, setNewLinkUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    // Upload state
    const [uploadingPdf, setUploadingPdf] = useState(false)
    
    // Test Bot state
    const [testMessage, setTestMessage] = useState("")
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'bot', content: string}[]>([
        { role: 'bot', content: 'Hi! Test your settings here. How can I help you today?' }
    ])
    const [chatLoading, setChatLoading] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    // Unanswered Questions state
    const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQ[]>([])
    const [uqLoading, setUqLoading] = useState(true)
    const [answeringId, setAnsweringId] = useState<string | null>(null)
    const [answerText, setAnswerText] = useState("")
    const [submittingAnswer, setSubmittingAnswer] = useState(false)
    const [uqExpanded, setUqExpanded] = useState(true)

    // WhatsApp Integration state
    const [wsStatus, setWsStatus] = useState({ 
        isReady: false, 
        qrCode: null as string | null, 
        disconnecting: false,
        providerStatus: null as any 
    })
    const [wsLoading, setWsLoading] = useState(false)
    const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false)

    const handleSettings = async () => {
        setLoading(true)
        try {
            const result = await axios.post("/api/settings", { ownerId, businessName, supportEmail, knowledge, whatsappNumber, mediaLinks })
            console.log(result.data)
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (ownerId) {
            const handleGetDetails = async () => {
                try {
                    const result = await axios.post("/api/settings/get", { ownerId })
                    if (result.data) {
                        setBusinessName(result.data.businessName || "")
                        setSupportEmail(result.data.supportEmail || "")
                        setKnowledge(result.data.knowledge || "")
                        setWhatsappNumber(result.data.whatsappNumber || "")
                        setMediaLinks(result.data.mediaLinks || [])
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            handleGetDetails()
            fetchUnansweredQuestions()
            // Initial poll for WhatsApp status
            pollWhatsAppStatus()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerId])

    useEffect(() => {
        if (!ownerId) return;
        
        const interval = setInterval(async () => {
            // Poll when: waiting for QR, or disconnecting (to detect when it's done)
            if (!wsStatus.isReady) {
                await pollWhatsAppStatus();
            }
        }, 5000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerId, wsStatus.isReady]);

    const pollWhatsAppStatus = async () => {
        try {
            const res = await axios.post("/api/whatsapp/qr", { ownerId });
            setWsStatus(prev => ({
                isReady: res.data.isReady,
                qrCode: res.data.qrCode,
                disconnecting: res.data.disconnecting ?? false,
                providerStatus: res.data.providerStatus
            }));
        } catch (err) {
            console.error("Failed to poll WhatsApp status", err);
        }
    };

    const handleConnectWhatsApp = async () => {
        setWsLoading(true);
        try {
            await axios.post("/api/whatsapp/connect", { ownerId });
            setWsStatus(prev => ({ ...prev, isReady: false, qrCode: null, disconnecting: false }));
        } catch (err) {
            console.error("Failed to connect", err);
        } finally {
            setWsLoading(false);
        }
    };

    const handleDisconnectWhatsApp = async () => {
        setIsDisconnectDialogOpen(false);
        setWsLoading(true);
        try {
            await axios.post("/api/whatsapp/disconnect", { ownerId });
            setWsStatus(prev => ({ ...prev, isReady: false, qrCode: null, disconnecting: true }));
        } catch (err) {
            console.error("Failed to disconnect", err);
        } finally {
            setWsLoading(false);
        }
    };

    const fetchUnansweredQuestions = async () => {
        try {
            setUqLoading(true)
            const res = await axios.get(`/api/unanswered-questions?ownerId=${ownerId}`)
            setUnansweredQuestions(res.data)
        } catch (err) {
            console.error("Failed to fetch unanswered questions", err)
        } finally {
            setUqLoading(false)
        }
    }

    const handleAnswerQuestion = async (questionId: string) => {
        if (!answerText.trim()) return
        setSubmittingAnswer(true)
        try {
            const res = await axios.post("/api/unanswered-questions/answer", {
                questionId,
                ownerId,
                answer: answerText
            })
            // Update local knowledge from DB response
            if (res.data.updatedKnowledge) {
                setKnowledge(res.data.updatedKnowledge)
            }
            setAnsweringId(null)
            setAnswerText("")
            fetchUnansweredQuestions()
        } catch (err) {
            console.error("Failed to answer question", err)
            alert("Failed to submit answer.")
        } finally {
            setSubmittingAnswer(false)
        }
    }

    const handleDismissQuestion = async (questionId: string) => {
        try {
            await axios.post("/api/unanswered-questions/delete", { questionId })
            setUnansweredQuestions(prev => prev.filter(q => q._id !== questionId))
        } catch (err) {
            console.error("Failed to dismiss question", err)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPdf(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ownerId", ownerId || "");

        try {
            const res = await axios.post("/api/upload-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.text) {
                // Append extracted PDF text to the knowledge box
                setKnowledge(prev => (prev ? prev + `\n\n--- [PDF: ${file.name}] ---\n\n${res.data.text}` : res.data.text));
                alert(`✅ PDF "${file.name}" extracted successfully! The content has been added to your Knowledge Base. Click Save to apply.`);
            }
        } catch (err) {
            console.error("Failed to parse PDF", err);
            alert("Failed to extract text from PDF document");
        } finally {
            setUploadingPdf(false);
            e.target.value = ''; // Reset input
        }
    }


    const handleTestChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testMessage.trim()) return;

        const userMsg = testMessage;
        setTestMessage("");
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatLoading(true);

        try {
            const res = await axios.post("/api/chat", {
                ownerId,
                contactNumber: "web-sandbox",
                history: chatHistory.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                })),
                message: userMsg
            });
            
            setChatHistory(prev => [...prev, { role: 'bot', content: res.data }]);
        } catch (err) {
            console.error("Chat error", err);
            setChatHistory(prev => [...prev, { role: 'bot', content: "Error reaching AI bot." }]);
        } finally {
            setChatLoading(false);
        }
    }

    const handleResetChat = async () => {
        if (!ownerId) return;
        setIsResetting(true);
        try {
            await axios.post("/api/chat/reset", { ownerId, contactNumber: "web-sandbox" });
            setChatHistory([]);
            setTestMessage("");
        } catch (error) {
            console.error("Reset error:", error);
        } finally {
            setIsResetting(false);
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return "just now"
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <div className='min-h-screen bg-zinc-50 text-zinc-900'>
            <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
            >
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='text-lg font-semibold tracking-tight' onClick={() => navigate.push("/")}>Use <span className='text-zinc-400'>Converra</span></div>
                    <div className='flex gap-2 shrink-0'>
                        <button className='px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition' onClick={()=>navigate.push("/dashboard/analytics")}> Insights</button>
                        <button className='px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition' onClick={()=>navigate.push("/dashboard/crm/play")}> Play Mode</button>
                        <button className='px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition' onClick={()=>navigate.push("/dashboard/crm")}> CRM</button>
                        <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={()=>navigate.push("/dashboard/agent-instructions")}> AI Rules</button>
                        <button className='px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition' onClick={()=>navigate.push("/dashboard/corrections")}>🧠 AI Learning</button>
                    </div>
                </div>
            </motion.div>

            <div className='max-w-7xl mx-auto px-4 mt-24 mb-[-40px]'>
                <AnimatePresence>
                    {(wsStatus.providerStatus?.openai?.error || wsStatus.providerStatus?.gemini?.error) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm"
                        >
                            <span className="text-xl"></span>
                            <div>
                                <h3 className="text-sm font-bold text-red-900">AI Provider Alert</h3>
                                <div className="text-xs text-red-700 mt-1 space-y-1">
                                    {wsStatus.providerStatus?.openai?.error && (
                                        <p><strong>OpenAI:</strong> {wsStatus.providerStatus.openai.error}</p>
                                    )}
                                    {wsStatus.providerStatus?.gemini?.error && (
                                        <p><strong>Gemini:</strong> {wsStatus.providerStatus.gemini.error}</p>
                                    )}
                                </div>
                                <p className="text-[10px] text-red-500 mt-2">
                                    Your AI might be temporarily offline. Please check your billing or API settings.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
                <div className='space-y-10'>
                    <motion.div
                        className='w-full bg-white rounded-2xl shadow-xl p-10 relative'
                    >
                        <div className='mb-10'>
                            <h1 className='text-2xl font-semibold'>ChatBot Settings</h1>
                            <p className='text-zinc-500 mt-1'> Manage your AI chatbot knowledge and business details</p>
                        </div>

                        <div className='mb-10'>
                            <h1 className='text-lg font-medium mb-4'>Business Details</h1>
                            <div className='space-y-4'>
                                <input type="text" className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' placeholder='Business Name' value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                                <input type="text" className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' placeholder='Support Email' value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                                <input type="text" className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' placeholder='WhatsApp Number (e.g. 15551234567)' value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} />
                            </div>
                        </div>
                        <div className='mb-10'>
                            <h1 className='text-lg font-medium mb-4'>Knowledge Base</h1>
                            <p className='text-sm text-zinc-500 mb-4'>Add FAQs, policies, delivery info, refunds, or upload PDFs.</p>
                            <div className='space-y-4'>
                                <textarea className='w-full h-54 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 font-mono' placeholder={`Example:\n• Refund policy: 7 days return available\n• Delivery time: 3–5 working days\n• Cash on Delivery available\n• Support hours`} onChange={(e) => setKnowledge(e.target.value)} value={knowledge} />
                                
                                <div className='flex items-center gap-3'>
                                    <label className='cursor-pointer flex-shrink-0'>
                                        <div className={`px-4 py-2 border border-zinc-300 rounded-lg text-sm transition ${uploadingPdf ? 'bg-zinc-100 text-zinc-400' : 'bg-white hover:bg-zinc-50 text-zinc-700'}`}>
                                            {uploadingPdf ? 'Scraping PDF...' : ' Upload PDF'}
                                        </div>
                                        <input type="file" accept="application/pdf" className='hidden' onChange={handleFileUpload} disabled={uploadingPdf} />
                                    </label>
                                    <span className='text-xs text-zinc-400 max-w-[200px]'>Extracted text will be appended automatically above.</span>
                                </div>
                            </div>
                        </div>

                        <div className='mb-10'>
                            <h1 className='text-lg font-medium mb-4'>Media & Photo Links</h1>
                            <p className='text-sm text-zinc-500 mb-4'>Add image or product links here. The AI will send these specific links when asked about them.</p>
                            
                            <div className='space-y-3 mb-4'>
                                {mediaLinks.map((link, idx) => (
                                    <div key={idx} className='flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg p-3'>
                                        <div className='truncate pr-4'>
                                            <p className='text-sm font-semibold text-zinc-800'>{link.name}</p>
                                            <a href={link.url} target='_blank' rel='noreferrer' className='text-xs text-blue-500 hover:underline truncate block'>{link.url}</a>
                                        </div>
                                        <button onClick={() => setMediaLinks(prev => prev.filter((_, i) => i !== idx))} className='text-red-500 hover:text-red-700 text-sm font-medium px-2'>
                                            Delete
                                        </button>
                                    </div>
                                ))}
                                {mediaLinks.length === 0 && (
                                    <p className='text-xs text-zinc-400 italic'>No media links added yet.</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-zinc-400 ml-1 uppercase tracking-widest'>Section/Purpose</label>
                                        <input type="text" placeholder="e.g. 'Girls Hostel' or 'Main Location'" className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' value={newLinkName} onChange={e => setNewLinkName(e.target.value)} />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-bold text-zinc-400 ml-1 uppercase tracking-widest'>Link / URL</label>
                                        <input type="url" placeholder="https://..." className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if(newLinkName.trim() && newLinkUrl.trim()) {
                                            setMediaLinks(prev => [...prev, {name: newLinkName.trim(), url: newLinkUrl.trim()}]);
                                            setNewLinkName("");
                                            setNewLinkUrl("");
                                        } else {
                                            alert("Please fill in both the purpose and the URL to add a link.");
                                        }
                                    }}
                                    className='w-full md:w-auto px-10 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-zinc-900/10'
                                >
                                    + Add Link to Knowledge
                                </button>
                            </div>
                        </div>

                        <div className='flex items-center gap-5'>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={loading}
                                onClick={handleSettings}
                                className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                            >
                                {loading ? "Saving..." : "Save"}

                            </motion.button>
                            {saved && <motion.span
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-medium text-emerald-600"
                            >
                                 Settings saved
                            </motion.span>}

                        </div>

                    </motion.div>

                    {/* WhatsApp Integration Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className='w-full bg-white rounded-2xl shadow-xl p-10 relative overflow-hidden'
                    >
                        <div className='absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-3xl -mr-12 -mt-12'></div>
                        <div className='flex items-center justify-between mb-8'>
                            <div>
                                <h1 className='text-xl font-semibold flex items-center gap-2'>
                                    WhatsApp Integration
                                    <span className={`w-2 h-2 rounded-full ${wsStatus.isReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                                </h1>
                                <p className='text-zinc-500 text-sm mt-1'>Connect your WhatsApp Business to use AI locally</p>
                            </div>
                            {wsStatus.isReady && (
                                <button
                                    onClick={() => setIsDisconnectDialogOpen(true)}
                                    disabled={wsLoading}
                                    className='text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest'
                                >
                                    {wsLoading ? "..." : "Disconnect"}
                                </button>
                            )}
                        </div>

                        {wsStatus.isReady ? (
                            <div className='bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex items-center gap-5'>
                                <div className='w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-600/20'>
                                    
                                </div>
                                <div>
                                    <p className='font-bold text-emerald-900'>System Connected</p>
                                    <p className='text-xs text-emerald-600 font-medium'>AI is now answering messages on {whatsappNumber || "your linked number"}</p>
                                </div>
                            </div>
                        ) : wsStatus.disconnecting ? (
                            <div className='flex flex-col items-center py-10'>
                                <div className='w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5 animate-pulse'>
                                    <span className='text-2xl'></span>
                                </div>
                                <p className='text-sm font-medium text-zinc-600'>Disconnecting...</p>
                                <p className='text-[10px] text-zinc-400 mt-2 uppercase tracking-widest'>Please wait a moment</p>
                            </div>
                        ) : wsStatus.qrCode ? (
                            <div className='flex flex-col items-center text-center py-6'>
                                <div className='bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mb-6'>
                                    <QRCode value={wsStatus.qrCode} size={200} viewBox={`0 0 256 256`} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                                </div>
                                <h2 className='text-lg font-bold text-zinc-900'>Scan to Link</h2>
                                <p className='text-sm text-zinc-500 max-w-xs mt-2'>Open WhatsApp on your phone → Settings → Linked Devices → Link a Device</p>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center py-10 transition-all'>
                                <div className='w-14 h-14 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center mb-5'>
                                    <span className='text-2xl'></span>
                                </div>
                                <p className='text-sm font-medium text-zinc-700 mb-1'>Not Connected</p>
                                <p className='text-xs text-zinc-400 mb-6'>Connect your WhatsApp to start answering customer messages automatically.</p>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={wsLoading}
                                    onClick={handleConnectWhatsApp}
                                    className='px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition disabled:opacity-60'
                                >
                                    {wsLoading ? 'Connecting...' : ' Connect WhatsApp'}
                                </motion.button>
                            </div>
                        )}
                    </motion.div>

                    {/* Unanswered Questions Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='w-full bg-white rounded-2xl shadow-xl overflow-hidden'
                    >
                        <button 
                            onClick={() => setUqExpanded(!uqExpanded)}
                            className='w-full px-8 py-5 flex items-center justify-between hover:bg-zinc-50 transition'
                        >
                            <div className='flex items-center gap-3'>
                                <div className='w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-base'>
                                    
                                </div>
                                <div className='text-left'>
                                    <h2 className='text-lg font-semibold text-zinc-900'>Unanswered Questions</h2>
                                    <p className='text-xs text-zinc-400 mt-0.5'>Questions your bot couldn&apos;t answer from the knowledge base</p>
                                </div>
                                {unansweredQuestions.length > 0 && (
                                    <span className='ml-2 px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full'>
                                        {unansweredQuestions.length}
                                    </span>
                                )}
                            </div>
                            <motion.span 
                                animate={{ rotate: uqExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className='text-zinc-400 text-lg'
                            >
                                ▾
                            </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                            {uqExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className='overflow-hidden'
                                >
                                    <div className='px-8 pb-6 border-t border-zinc-100'>
                                        {uqLoading ? (
                                            <div className='py-10 text-center text-sm text-zinc-400'>Loading questions...</div>
                                        ) : unansweredQuestions.length === 0 ? (
                                            <div className='py-10 text-center'>
                                                <div className='text-3xl mb-2'></div>
                                                <p className='text-sm text-zinc-500 font-medium'>All caught up!</p>
                                                <p className='text-xs text-zinc-400 mt-1'>No unanswered questions right now.</p>
                                            </div>
                                        ) : (
                                            <div className='space-y-3 mt-4 max-h-[500px] overflow-y-auto pr-1'>
                                                {unansweredQuestions.map((q) => (
                                                    <motion.div
                                                        key={q._id}
                                                        layout
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                                        className='border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 hover:bg-zinc-50 transition'
                                                    >
                                                        <div className='flex items-start justify-between gap-3'>
                                                            <div className='flex-1 min-w-0'>
                                                                <p className='text-sm font-medium text-zinc-800 leading-relaxed'>&quot;{q.question}&quot;</p>
                                                                <div className='flex items-center gap-2 mt-2'>
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                                                                        q.source === "whatsapp" 
                                                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                                                            : "bg-blue-50 text-blue-600 border border-blue-200"
                                                                    }`}>
                                                                        {q.source === "whatsapp" ? "" : ""} {q.source}
                                                                    </span>
                                                                    <span className='text-[11px] text-zinc-400'>{formatTimeAgo(q.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                            <div className='flex items-center gap-1.5 shrink-0'>
                                                                <button
                                                                    onClick={() => {
                                                                        setAnsweringId(answeringId === q._id ? null : q._id)
                                                                        setAnswerText("")
                                                                    }}
                                                                    className='px-3 py-1.5 text-xs font-medium rounded-lg bg-black text-white hover:bg-zinc-800 transition'
                                                                >
                                                                    {answeringId === q._id ? "Cancel" : "Answer"}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDismissQuestion(q._id)}
                                                                    className='px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition'
                                                                >
                                                                    Dismiss
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {answeringId === q._id && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className='overflow-hidden'
                                                                >
                                                                    <div className='mt-3 pt-3 border-t border-zinc-200'>
                                                                        <textarea
                                                                            value={answerText}
                                                                            onChange={(e) => setAnswerText(e.target.value)}
                                                                            placeholder='Type the answer... This will be added to your knowledge base.'
                                                                            className='w-full h-20 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 resize-none'
                                                                            autoFocus
                                                                        />
                                                                        <div className='flex items-center justify-between mt-2'>
                                                                            <span className='text-[11px] text-zinc-400'> This Q&A will be added to your knowledge base</span>
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.03 }}
                                                                                whileTap={{ scale: 0.97 }}
                                                                                disabled={submittingAnswer || !answerText.trim()}
                                                                                onClick={() => handleAnswerQuestion(q._id)}
                                                                                className='px-4 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50'
                                                                            >
                                                                                {submittingAnswer ? "Saving..." : "Save Answer"}
                                                                            </motion.button>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Test ChatBot Output Sandbox */}
                <motion.div
                    className='w-full bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden sticky top-28 flex flex-col'
                    style={{ height: '700px' }}
                >
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <h3 className="font-medium text-white/90">Test Your Bot</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResetChat}
                                disabled={isResetting}
                                className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all border border-white/5"
                            >
                                {isResetting ? "Resetting..." : "Reset Chat"}
                            </button>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Sandbox</span>
                        </div>
                    </div>

                    <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50 flex flex-col'>
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`text-sm px-4 py-3 rounded-2xl max-w-[75%] leading-relaxed break-words ${
                                    msg.role === 'user' 
                                        ? 'bg-black text-white rounded-br-sm' 
                                        : 'bg-white border border-zinc-200 shadow-sm text-zinc-700 rounded-bl-sm tracking-wide'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className='flex justify-start'>
                                <div className='text-sm px-4 py-3 rounded-2xl max-w-[85%] bg-white border border-zinc-200 shadow-sm text-zinc-500 flex gap-1 items-center rounded-bl-sm'>
                                    <span className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                                    <span className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                                    <span className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleTestChat} className='p-4 bg-white border-t border-zinc-200 flex gap-2 shrink-0'>
                        <input 
                            type="text" 
                            className='flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' 
                            placeholder='Ask a test question...' 
                            value={testMessage} 
                            onChange={(e) => setTestMessage(e.target.value)} 
                            disabled={chatLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={chatLoading || !testMessage.trim()} 
                            className='bg-black text-white px-5 rounded-xl text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition'
                        >
                            Send
                        </button>
                    </form>
                </motion.div>
            </div>

            <Dialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Disconnect WhatsApp?</DialogTitle>
                        <DialogDescription>
                            This will stop the AI from answering messages on your linked number. You will need to scan the QR code to reconnect.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsDisconnectDialogOpen(false)}
                            className="px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDisconnectWhatsApp}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                        >
                            Disconnect Now
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DashboardClient
