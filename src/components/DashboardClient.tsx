'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'
import axios from 'axios'
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
     useEffect(()=>{
if(ownerId){
    const handleGetDetails=async ()=>{
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
}

     },[ownerId])

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

    return (
        <div className='min-h-screen bg-zinc-50 text-zinc-900'>
            <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
            >
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='text-lg font-semibold tracking-tight' onClick={() => navigate.push("/")}>Support <span className='text-zinc-400'>AI</span></div>
                    <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={()=>navigate.push("/embed")}>Embed ChatBot</button>
                </div>
            </motion.div>

            <div className='max-w-7xl mx-auto px-4 py-14 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
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
                            <textarea className='w-full h-54 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 font-mono' placeholder={`Example:
• Refund policy: 7 days return available
• Delivery time: 3–5 working days
• Cash on Delivery available
• Support hours`} onChange={(e) => setKnowledge(e.target.value)} value={knowledge} />
                            
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
