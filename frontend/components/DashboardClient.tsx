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

interface UnansweredQuestion {
    _id: string;
    question: string;
    contactNumber?: string;
    source: "widget" | "whatsapp";
    status: string;
    createdAt: string;
}

function DashboardClient({ ownerId, userName, userEmail }: { ownerId: string, userName?: string, userEmail?: string }) {
    const navigate = useRouter()
    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledge, setKnowledge] = useState("")
    const [whatsappNumber, setWhatsappNumber] = useState("")
    const [agentInstructions, setAgentInstructions] = useState("")
    const [mediaLinks, setMediaLinks] = useState<{name: string, url: string}[]>([])
    const [newLinkName, setNewLinkName] = useState("")
    const [newLinkUrl, setNewLinkUrl] = useState("")
    const [aiOverrides, setAiOverrides] = useState<{topic: string, response: string}[]>([])
    const [newOverrideTopic, setNewOverrideTopic] = useState("")
    const [newOverrideResponse, setNewOverrideResponse] = useState("")

    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    // Upload state
    const [uploadingPdf, setUploadingPdf] = useState(false)
    const [refining, setRefining] = useState(false)
    
    // Test Bot state
    const [testMessage, setTestMessage] = useState("")
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'bot', content: string}[]>([
        { role: 'bot', content: 'Hi! Test your settings here. How can I help you today?' }
    ])
    const [chatLoading, setChatLoading] = useState(false)

    // Unanswered Questions state
    const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>([])
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

    const handleSettings = async (manualData?: any) => {
        setLoading(true)
        try {
            const data = manualData || { 
                ownerId, 
                businessName, 
                supportEmail, 
                knowledge, 
                whatsappNumber, 
                agentInstructions,
                mediaLinks,
                aiOverrides 
            }
            const result = await axios.post("/api/settings", data)
            console.log(result.data)
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
            return result.data
        } catch (error) {
            console.log(error)
            setLoading(false)
            throw error
        }
    }

    const deleteMediaLink = async (idx: number) => {
        const updated = mediaLinks.filter((_, i) => i !== idx);
        setMediaLinks(updated);
        await handleSettings({ 
            ownerId, businessName, supportEmail, knowledge, whatsappNumber, agentInstructions, 
            mediaLinks: updated, aiOverrides 
        });
    };

    const deleteOverride = async (idx: number) => {
        const updated = aiOverrides.filter((_, i) => i !== idx);
        setAiOverrides(updated);
        await handleSettings({ 
            ownerId, businessName, supportEmail, knowledge, whatsappNumber, agentInstructions, 
            mediaLinks, aiOverrides: updated 
        });
    };

    const resetAllData = async () => {
        if (confirm("⚠️ DANGER: This will permanently delete ALL your chatbot data from the database. Are you sure?")) {
            setBusinessName("");
            setSupportEmail("");
            setKnowledge("");
            setWhatsappNumber("");
            setAgentInstructions("");
            setMediaLinks([]);
            setAiOverrides([]);
            
            await handleSettings({
                ownerId,
                businessName: "",
                supportEmail: "",
                knowledge: "",
                whatsappNumber: "",
                agentInstructions: "",
                mediaLinks: [],
                aiOverrides: []
            });
            alert("All data has been deleted from everywhere.");
        }
    };

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
                        setAgentInstructions(result.data.agentInstructions || "")
                        setMediaLinks(result.data.mediaLinks || [])
                        setAiOverrides(result.data.aiOverrides || [])
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
    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
            navigate.push("/login");
        } catch (err) {
            console.error("Logout failed", err);
            // Fallback: clear cookies via client side if possible or just redirect
            navigate.push("/login");
        }
    };
    useEffect(() => {
        if (!ownerId) return;
        
        const uqInterval = setInterval(async () => {
            await fetchUnansweredQuestions(true); // Background refresh
        }, 15000); // Every 15 seconds

        return () => clearInterval(uqInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerId]);

    const fetchUnansweredQuestions = async (isBackground = false) => {
        try {
            if (!isBackground) setUqLoading(true)
            const res = await axios.get(`/api/unanswered-questions?ownerId=${ownerId}`)
            setUnansweredQuestions(res.data)
        } catch (err) {
            console.error("Failed to fetch unanswered questions", err)
        } finally {
            if (!isBackground) setUqLoading(false)
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

        try {
            const res = await axios.post("/api/upload-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.text) {
                const pdfContent = `\n\n--- [PDF Content: ${file.name}] ---\n\n${res.data.text}`;
                const updatedKnowledge = knowledge + pdfContent;
                
                // 1. Update the UI textarea
                setKnowledge(updatedKnowledge);

                // 2. Immediately auto-save to trigger RAG chunking pipeline
                setLoading(true);
                await axios.post("/api/settings", {
                    ownerId,
                    businessName,
                    supportEmail,
                    knowledge: updatedKnowledge,
                    whatsappNumber,
                    mediaLinks
                });
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                setLoading(false);
                console.log("[PDF] Knowledge auto-saved and RAG chunks indexed.");
            }
        } catch (err) {
            console.error("Failed to parse PDF", err);
            alert("Failed to extract text from PDF document");
            setLoading(false);
        } finally {
            setUploadingPdf(false);
            e.target.value = ''; // Reset input
        }
    }

    const handleRefineKnowledge = async () => {
        if (!knowledge.trim() || knowledge.length < 20) return;
        setRefining(true);
        try {
            const res = await axios.post("/api/knowledge/refine", { text: knowledge });
            if (res.data.refinedText) {
                setKnowledge(res.data.refinedText);
            }
        } catch (err: any) {
            console.error("Refinement failed", err);
            const msg = err.response?.data?.message || err.message || "Unknown error";
            alert(`Failed to refine knowledge base: ${msg}`);
        } finally {
            setRefining(false);
        }
    };

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
                    <div className='flex gap-2 shrink-0 items-center'>
                        <div className='mr-4 flex flex-col items-end'>
                            <span className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest'>Logged in as</span>
                            <span className='text-xs font-semibold text-zinc-900'>{userName || 'User'}</span>
                            <span className='text-[10px] text-zinc-500'>{userEmail}</span>
                        </div>
                        <button className='px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition' onClick={()=>navigate.push("/dashboard/analytics")}> Insights</button>
                        <button className='px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition' onClick={()=>navigate.push("/dashboard/crm/play")}> Play Mode</button>
                        <button className='px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition' onClick={()=>navigate.push("/dashboard/crm")}> CRM</button>
                        <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={()=>navigate.push("/dashboard/agent-instructions")}> AI Rules</button>
                        <button className='px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition mr-2' onClick={()=>navigate.push("/dashboard/corrections")}>🧠 AI Learning</button>
                        
                        <button 
                            onClick={handleLogout}
                            className='p-2 rounded-lg hover:bg-red-50 text-red-500 transition'
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </button>
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
                            <h1 className='text-lg font-medium mb-4'>Agent Instructions</h1>
                            <p className='text-sm text-zinc-500 mb-4'>Custom rules for how the AI should behave (e.g. "Always be professional", "Mention current discounts").</p>
                            <textarea 
                                className='w-full h-32 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' 
                                placeholder="Example: 'Speak in a friendly tone', 'Focus on booking meetings', 'Don't give technical details'"
                                onChange={(e) => setAgentInstructions(e.target.value)} 
                                value={agentInstructions} 
                            />
                        </div>

                        <div className='mb-10'>
                            <div className='flex items-center justify-between mb-4'>
                                <h1 className='text-lg font-medium'>Knowledge Base</h1>
                                {knowledge.trim() && (
                                    <button 
                                        onClick={async () => { 
                                            if(confirm("Clear entire Knowledge Base and delete from database?")) {
                                                setKnowledge("");
                                                await handleSettings({
                                                    ownerId, businessName, supportEmail, knowledge: "", whatsappNumber, agentInstructions, mediaLinks, aiOverrides
                                                });
                                            }
                                        }}
                                        className='text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest'
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
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

                                    <button 
                                        type="button"
                                        onClick={handleRefineKnowledge}
                                        disabled={refining || !knowledge.trim()}
                                        className={`px-4 py-2 border border-violet-200 rounded-lg text-sm transition ${refining ? 'bg-violet-50 text-violet-400' : 'bg-violet-50 hover:bg-violet-100 text-violet-700'}`}
                                    >
                                        {refining ? 'Restructuring...' : '✨ AI Refine (Beta)'}
                                    </button>

                                    <span className='text-xs text-zinc-400 max-w-[150px]'>Structure messy text into Q&A for better accuracy.</span>
                                </div>
                            </div>
                        </div>

                        <div className='mb-10'>
                            <h1 className='text-lg font-medium mb-4 text-violet-700'>✨ AI Overrides (Rules)</h1>
                            <p className='text-sm text-zinc-500 mb-4'>Define specific responses for certain keywords to bypass AI and save costs.</p>
                            
                            <div className='space-y-3 mb-4'>
                                {aiOverrides.map((override, idx) => (
                                    <div key={idx} className='bg-violet-50/50 border border-violet-100 rounded-lg p-3'>
                                        <div className='flex items-start justify-between'>
                                            <div className='pr-4'>
                                                <p className='text-xs font-bold text-violet-600 uppercase tracking-wider'>Topic: {override.topic}</p>
                                                <p className='text-sm text-zinc-800 mt-1'>{override.response}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <button 
                                                    onClick={() => {
                                                        setNewOverrideTopic(override.topic);
                                                        setNewOverrideResponse(override.response);
                                                        setAiOverrides(prev => prev.filter((_, i) => i !== idx));
                                                    }}
                                                    className='text-zinc-400 hover:text-zinc-600 text-sm font-medium px-2'
                                                >
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteOverride(idx)} className='text-red-500 hover:text-red-700 text-sm font-medium px-2'>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {aiOverrides.length === 0 && (
                                    <p className='text-xs text-zinc-400 italic'>No custom rules added yet.</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <input type="text" placeholder="Trigger Keyword or Topic (e.g. 'refund' or 'timing')" className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50' value={newOverrideTopic} onChange={e => setNewOverrideTopic(e.target.value)} />
                                <textarea placeholder="Fixed Response (The bot will say exactly this)" className='w-full h-20 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50' value={newOverrideResponse} onChange={e => setNewOverrideResponse(e.target.value)} />
                                <button
                                    onClick={() => {
                                        if(newOverrideTopic.trim() && newOverrideResponse.trim()) {
                                            setAiOverrides(prev => [...prev, {topic: newOverrideTopic.trim(), response: newOverrideResponse.trim()}]);
                                            setNewOverrideTopic("");
                                            setNewOverrideResponse("");
                                        }
                                    }}
                                    className='w-full px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition'
                                >
                                    + Add AI Rule Override
                                </button>
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
                                        <div className='flex gap-2'>
                                            <button 
                                                onClick={() => {
                                                    setNewLinkName(link.name);
                                                    setNewLinkUrl(link.url);
                                                    setMediaLinks(prev => prev.filter((_, i) => i !== idx));
                                                }}
                                                className='text-zinc-400 hover:text-zinc-600 text-sm font-medium px-2'
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteMediaLink(idx)} className='text-red-500 hover:text-red-700 text-sm font-medium px-2'>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {mediaLinks.length === 0 && (
                                    <p className='text-xs text-zinc-400 italic'>No media links added yet.</p>
                                )}
                            </div>

                            <div className='flex gap-2 items-center'>
                                <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-2'>
                                    <input type="text" placeholder="Label (e.g., 'Pricing PDF' or 'Hostel Photo')" className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' value={newLinkName} onChange={e => setNewLinkName(e.target.value)} />
                                    <input type="url" placeholder="https://..." className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} />
                                </div>
                                <button
                                    onClick={() => {
                                        if(newLinkName.trim() && newLinkUrl.trim()) {
                                            setMediaLinks(prev => [...prev, {name: newLinkName.trim(), url: newLinkUrl.trim()}]);
                                            setNewLinkName("");
                                            setNewLinkUrl("");
                                        }
                                    }}
                                    className='px-4 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition whitespace-nowrap'
                                >
                                    + Add Link
                                </button>
                            </div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-5'>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={loading}
                                    onClick={() => handleSettings()}
                                    className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                                >
                                    {loading ? "Saving..." : "Save Settings"}
                                </motion.button>
                                {saved && <motion.span
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm font-medium text-emerald-600"
                                >
                                     ✓ Settings saved
                                </motion.span>}
                            </div>

                            <button
                                onClick={resetAllData}
                                className='text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest'
                            >
                                Reset All Data
                            </button>
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
                                    <div className='flex items-center gap-2'>
                                        <h2 className='text-lg font-semibold text-zinc-800'>Unanswered Questions</h2>
                                        <span className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider'>
                                            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                                            Live
                                        </span>
                                    </div>
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
                                                                        {q.source === "whatsapp" ? "🟢" : "🌐"} {q.source}
                                                                    </span>
                                                                    {q.contactNumber && (
                                                                        <span className='text-[11px] font-medium text-zinc-600 bg-zinc-200/50 px-2 py-0.5 rounded-md'>
                                                                            {q.contactNumber.replace("@c.us", "")}
                                                                        </span>
                                                                    )}
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
                                                                            placeholder={q.source === "whatsapp" ? "Type your answer... This will be sent to the customer on WhatsApp instantly." : "Type the answer... This will be added to your knowledge base."}
                                                                            className='w-full h-20 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 resize-none'
                                                                            autoFocus
                                                                        />
                                                                        <div className='flex items-center justify-between mt-2'>
                                                                            <span className='text-[11px] text-zinc-400'>
                                                                                {q.source === "whatsapp" 
                                                                                    ? "✓ Sent to customer + Added to Knowledge Base" 
                                                                                    : "✓ Added to Knowledge Base for future AI replies"}
                                                                            </span>
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
                    <div className='bg-black text-white px-6 py-4 flex justify-between items-center shrink-0'>
                        <div className='font-medium flex items-center gap-3'>
                            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
                            Test Your Bot
                        </div>
                        <span className='text-xs opacity-60'>Sandbox</span>
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
