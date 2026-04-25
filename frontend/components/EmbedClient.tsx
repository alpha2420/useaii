'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import axios from "axios"
import QRCode from "react-qr-code"
function EmbedClient({ ownerId }: { ownerId: string }) {
    const navigate = useRouter()
    const [copied, setCopied] = useState(false)
    const [whatsappState, setWhatsappState] = useState<{ isReady: boolean, qrCode: string | null, loading: boolean }>({
        isReady: false,
        qrCode: null,
        loading: true
    })
    const [disconnecting, setDisconnecting] = useState(false)

    useEffect(() => {
        if (!ownerId) return;

        const checkStatus = () => {
             axios.post("/api/whatsapp/qr", { ownerId }).then(res => {
                  setWhatsappState({
                      isReady: res.data.isReady,
                      qrCode: res.data.qrCode,
                      loading: false
                  })
             }).catch(e => {
                  console.error(e)
                  setWhatsappState(prev => ({ ...prev, loading: false }))
             })
        }

        checkStatus();
        const interval = setInterval(checkStatus, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [ownerId])

    const version = "1.0.2"; // Increment this when you make major changes
    const embedCode = `<script 
    src="${process.env.NEXT_PUBLIC_APP_URL}/chatBot.js?v=${version}" 
    data-owner-id="${ownerId}">
</script> `
    const copyCode = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to log out of WhatsApp? You will need to scan the QR code again.")) return;

        setDisconnecting(true);
        try {
            await axios.post("/api/whatsapp/disconnect", { ownerId });
            setWhatsappState({ isReady: false, qrCode: null, loading: true });
        } catch (e) {
            console.error("Failed to disconnect", e);
            alert("Failed to disconnect WhatsApp.");
        } finally {
            setDisconnecting(false);
        }
    }

    return (
        <div className='min-h-screen bg-zinc-50 text-zinc-900'>
            <div className='sticky top-0 z-40 bg-white border-b border-zinc-200'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='text-lg font-semibold cursor-pointer' onClick={() => navigate.push("/")}>Use<span className='text-zinc-400'>Converra</span></div>
                    <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={() => navigate.push("/dashboard")}>Back to Dashboard</button>
                </div>
            </div>

            <div className='flex justify-center px-4 py-14'>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl  bg-white rounded-2xl shadow-xl p-10"
                >
                    <h1 className='text-2xl font-semibold mb-2'>Embed ChatBot</h1>
                    <p>Copy and paste this code before <code>&lt;/body&gt;</code></p>
                    <div className='relative bg-zinc-900 text-zinc-100 rounded-xl p-5 text-sm font-mono mb-10'>
                        <pre className='overflow-x-auto'>{embedCode}</pre>
                        <button className='absolute top-3 right-3 bg-white text-zinc-900 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition' onClick={copyCode}>
                            {copied ? "Copied " : "Copy"}
                        </button>
                    </div>

                    <ol className='space-y-3  text-sm text-zinc-600 list-decimal list-inside'>
                        <li>Copy the embed script</li>
                        <li>Paste it before the closing body tag</li>
                        <li>Reload your website</li>
                    </ol>

                    <div className='mt-14'>
                        <h1 className='text-lg font-medium mb-2'>WhatsApp Web AI Bot</h1>
                        <p className='text-sm text-zinc-500 mb-6'>Scan this QR to link your WhatsApp account. The AI will instantly reply to your chats.</p>

                        <div className='p-6 border border-zinc-200 rounded-xl bg-zinc-50 flex items-center gap-6'>
                            <div className='bg-white p-3 rounded-xl shadow-sm border border-zinc-200 w-fit shrink-0 min-w-[150px] min-h-[150px] flex items-center justify-center'>
                                {whatsappState.loading ? (
                                    <span className='text-sm text-zinc-400'>Loading...</span>
                                ) : whatsappState.isReady ? (
                                    <div className='flex items-center justify-center w-[120px] h-[120px] bg-emerald-50 rounded-lg border border-emerald-200'>
                                        <span className='text-emerald-500 text-4xl'></span>
                                    </div>
                                ) : whatsappState.qrCode ? (
                                    <QRCode value={whatsappState.qrCode} size={120} />
                                ) : (
                                    <span className='text-sm text-zinc-400 text-center animate-pulse'>Starting<br/>browser...</span>
                                )}
                            </div>
                            <div>
                                {whatsappState.isReady ? (
                                    <>
                                        <h3 className='font-medium text-emerald-600 flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-emerald-500'></span> Connected & Active</h3>
                                        <p className='text-sm text-zinc-500 mt-1 max-w-sm'>Your WhatsApp is linked. The AI bot is now listening and replying to messages automatically.</p>
                                        <button 
                                            onClick={handleDisconnect} 
                                            disabled={disconnecting} 
                                            className='mt-4 px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-medium rounded-lg text-sm hover:bg-red-100 transition disabled:opacity-50'
                                        >
                                            {disconnecting ? "Disconnecting..." : "Disconnect WhatsApp"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className='font-medium text-zinc-800'>Link your device</h3>
                                        <ol className='text-sm text-zinc-500 mt-2 list-decimal list-inside space-y-1'>
                                            <li>Open WhatsApp on your phone</li>
                                            <li>Tap Menu ⠇ or Settings </li>
                                            <li>Select <strong>Linked Devices</strong></li>
                                            <li>Point your phone at the screen to capture the QR code</li>
                                        </ol>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='mt-14'>
                        <h1 className='text-lg font-medium mb-2'>Live Preview</h1>
                        <p className='text-sm text-zinc-500 mb-6'>This is how the chatbot will appear on your website</p>

                        <div className='rounded-xl border border-zinc-300 bg-white shadow-md overflow-hidden'>
                            <div className='flex items-center gap-2 px-4 h-9 bg-zinc-100 border-b border-zinc-200'>
                                <span className='w-2.5 h-2.5 rounded-full bg-red-400' />
                                <span className='w-2.5 h-2.5 rounded-full bg-yellow-400' />
                                <span className='w-2.5 h-2.5 rounded-full bg-green-400' />
                                <span className='ml-4 text-xs text-zinc-500'>Your-website.com</span>
                            </div>
                            <div className='relative h-64 sm:h-72 p-6 text-zinc-400 text-sm'>

                                Your website goes here



                                <div className='absolute bottom-24 right-6 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden'>
                                    <div className='bg-black text-white text-xs px-3 py-2 flex justify-between items-center'>
                                        <span>Customer Support</span>
                                        <span>╳</span>
                                    </div>

                                    <div className='p-3 space-y-2 bg-zinc-50'>
                                        <div className='bg-zinc-200 text-zinc-800 text-xs px-3 py-2 rounded-lg w-fit'>hi! how can I help you?</div>
                                        <div className='bg-black text-white text-xs px-3 py-2 rounded-lg ml-auto w-fit'>what is the return policy?</div>
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="
      absolute bottom-6 right-6
      w-14 h-14 rounded-full
      bg-black text-white
      flex items-center justify-center
      shadow-2xl
      cursor-pointer
    "
                                >
                                    
                                </motion.div>



                            </div>
                        </div>

                    </div>




                </motion.div>
            </div>


        </div>
    )
}

export default EmbedClient
