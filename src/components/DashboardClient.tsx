'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useRouter } from 'next/navigation'
import axios from 'axios'

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

    // Unanswered Questions state
    const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQ[]>([])
    const [uqLoading, setUqLoading] = useState(true)
    const [answeringId, setAnsweringId] = useState<string | null>(null)
    const [answerText, setAnswerText] = useState("")
    const [submittingAnswer, setSubmittingAnswer] = useState(false)
    const [uqExpanded, setUqExpanded] = useState(true)

    const handleSettings = async () => {
        setLoading(true)
        try {
            const result = await axios.post("/api/settings", { ownerId, businessName, supportEmail, knowledge, whatsappNumber })
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
                    setBusinessName(result.data.businessName || "")
                    setSupportEmail(result.data.supportEmail || "")
                    setKnowledge(result.data.knowledge || "")
                    setWhatsappNumber(result.data.whatsappNumber || "")
                } catch (error) {
                    console.log(error)
                }
            }
            handleGetDetails()
            fetchUnansweredQuestions()
        }
    }, [ownerId])

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

        try {
            const res = await axios.post("/api/upload-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.text) {
                setKnowledge(prev => prev + `\n\n--- [PDF Content: ${file.name}] ---\n\n${res.data.text}`);
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
                    <div className='text-lg font-semibold tracking-tight' onClick={() => navigate.push("/")}>Use <span className='text-zinc-400'>AI</span></div>
                    <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={()=>navigate.push("/embed")}>Embed ChatBot</button>
                </div>
            </motion.div>

            <div className='max-w-7xl mx-auto px-4 py-14 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
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
                                            {uploadingPdf ? 'Scraping PDF...' : '📄 Upload PDF'}
                                        </div>
                                        <input type="file" accept="application/pdf" className='hidden' onChange={handleFileUpload} disabled={uploadingPdf} />
                                    </label>
                                    <span className='text-xs text-zinc-400 max-w-[200px]'>Extracted text will be appended automatically above.</span>
                                </div>
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
                                ✓ Settings saved
                            </motion.span>}

                        </div>

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
                                    ❓
                                </div>
                                <div className='text-left'>
                                    <h2 className='text-lg font-semibold text-zinc-900'>Unanswered Questions</h2>
                                    <p className='text-xs text-zinc-400 mt-0.5'>Questions your bot couldn't answer from the knowledge base</p>
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
                                                <div className='text-3xl mb-2'>🎉</div>
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
                                                                <p className='text-sm font-medium text-zinc-800 leading-relaxed'>"{q.question}"</p>
                                                                <div className='flex items-center gap-2 mt-2'>
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                                                                        q.source === "whatsapp" 
                                                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                                                            : "bg-blue-50 text-blue-600 border border-blue-200"
                                                                    }`}>
                                                                        {q.source === "whatsapp" ? "💬" : "🌐"} {q.source}
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
                                                                            <span className='text-[11px] text-zinc-400'>💡 This Q&A will be added to your knowledge base</span>
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
                                <div className={`text-sm px-4 py-3 rounded-2xl max-w-[85%] ${
                                    msg.role === 'user' 
                                        ? 'bg-black text-white rounded-br-sm' 
                                        : 'bg-white border border-zinc-200 shadow-sm text-zinc-800 rounded-bl-sm'
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

        </div>
    )
}

export default DashboardClient
