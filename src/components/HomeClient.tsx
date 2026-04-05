'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { HeroLanding } from '@/components/ui/hero-1'
import { Inbox, FileText, Timer, TriangleAlert, Zap, Target, Globe } from 'lucide-react'
export default function HomeClient({ email }: { email: string }) {
    const [loading, setLoading] = useState(false)
    const navigate = useRouter()
    
    const handleLogin = () => {
        setLoading(true)
        navigate.push("/login")
    }
    
    const firstLetter = email ? email[0].toUpperCase() : ""
    const [open, setOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)

    // Review Form State
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [submittingReview, setSubmittingReview] = useState(false)
    const [reviewSuccess, setReviewSuccess] = useState(false)

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !feedback.trim()) return;
        setSubmittingReview(true);
        try {
            await axios.post("/api/reviews", { rating, feedback });
            setReviewSuccess(true); setRating(0); setFeedback("");
        } catch (err) {
            console.error("Failed to submit review", err);
            alert("Failed to submit review. Please try again.");
        } finally {
            setSubmittingReview(false);
        }
    }

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleLogOut = async () => {
        try {
            await axios.get("/api/auth/logout")
            window.location.href = "/"
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen bg-[#fafafa] text-zinc-900 font-sans overflow-x-hidden selection:bg-blue-200 selection:text-blue-900'>
            {/* Hero Section */}
            <HeroLanding
                logo={{
                    src: "",
                    alt: "UseAI Logo",
                    companyName: "Use.ai"
                }}
                navigation={[
                    { name: 'Features', href: '#features' },
                    { name: 'Pricing', href: '#pricing' },
                    { name: 'Reviews', href: '#reviews' },
                ]}
                loginText={email ? "Dashboard" : "Log in"}
                loginHref={email ? "/dashboard" : "/login"}
                title="AI that talks to your Customers."
                description="Upload your business docs, and UseAI instantly answers customer queries on your Website and WhatsApp — accurately, in any language, while you sleep."
                callToActions={[
                    ...(email ? [
                        { text: "Go to Dashboard", href: "/dashboard", variant: "primary" as const }
                    ] : [
                        { text: "Start Automating", href: "/login", variant: "primary" as const }
                    ]),
                    { text: "Book a call", href: "#", variant: "secondary" as const }
                ]}
                titleSize="large"
                gradientColors={{
                    from: "oklch(0.646 0.222 41.116)",
                    to: "oklch(0.488 0.243 264.376)"
                }}
            />



            {/* How It Works Section */}
            <section className='py-24 px-6 max-w-4xl mx-auto border-t border-zinc-100'>
                <div className='mb-16'>
                    <h2 className='text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-zinc-900'>
                        From zero to <span className='text-blue-600 italic'>live AI</span><br />in 5 minutes
                    </h2>
                    <p className='mt-6 text-zinc-500 font-medium max-w-lg leading-relaxed'>
                        No technical skills. No Meta approvals. No complex setup. Just three steps and your AI is answering customers.
                    </p>
                </div>

                <div className='flex flex-col gap-0'>
                    {/* Step 01 */}
                    <div className='flex gap-8 lg:gap-16 relative'>
                        <div className='flex flex-col items-center shrink-0'>
                            <div className='w-12 h-12 rounded-full border-2 border-zinc-300 text-zinc-500 flex items-center justify-center font-bold text-sm bg-white z-10'>01</div>
                            <div className='w-[2px] flex-1 bg-zinc-200 mt-2'></div>
                        </div>
                        <div className='pb-16 flex-1'>
                            <div className='inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-600 mb-5 uppercase tracking-wider'>Sign Up — 2 Minutes</div>
                            <h3 className='text-2xl font-bold text-zinc-900 mb-3'>Create your free account</h3>
                            <p className='text-zinc-500 font-medium leading-relaxed max-w-lg'>Visit UseAI, enter your business name, email, and password. Free account instantly — no credit card, no documents, no waiting.</p>
                        </div>
                    </div>

                    {/* Step 02 */}
                    <div className='flex gap-8 lg:gap-16 relative'>
                        <div className='flex flex-col items-center shrink-0'>
                            <div className='w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30 z-10'>02</div>
                            <div className='w-[2px] flex-1 bg-zinc-200 mt-2'></div>
                        </div>
                        <div className='pb-16 flex-1'>
                            <div className='inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-600 mb-5 uppercase tracking-wider'>Train AI — 3 Minutes</div>
                            <h3 className='text-2xl font-bold text-zinc-900 mb-3'>Paste your website URL — AI learns everything</h3>
                            <p className='text-zinc-500 font-medium leading-relaxed max-w-lg mb-8'>Type your website link and click Crawl. The system reads every page — products, prices, policies, FAQs. Or upload a PDF. Or type manual Q&A. AI becomes an expert on your business instantly.</p>

                            {/* Feature Grid Card */}
                            <div className='bg-zinc-50 border border-zinc-200 rounded-2xl p-6 max-w-2xl'>
                                <p className='text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5'>What Happens Technically</p>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {[
                                        { title: "Crawl & Chunk", desc: "Website text is split into 400-word pieces — each piece is one item of knowledge." },
                                        { title: "Embed & Index", desc: "Each chunk is converted to a 1536-number vector (its meaning in math) and stored in a vector database." },
                                        { title: "Semantic Search", desc: "Customer question finds the closest-meaning chunk — works across Hindi, English, Tamil." },
                                        { title: "Gemini Replies", desc: "AI generates a natural, friendly reply using only your text data — no hallucination." },
                                    ].map((f, i) => (
                                        <div key={i} className='bg-white p-5 rounded-xl border border-zinc-200 shadow-sm'>
                                            <p className='font-bold text-zinc-900 text-sm mb-2'>{f.title}</p>
                                            <p className='text-zinc-500 text-xs leading-relaxed'>{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 03 */}
                    <div className='flex gap-8 lg:gap-16'>
                        <div className='flex flex-col items-center shrink-0'>
                            <div className='w-12 h-12 rounded-full border-2 border-zinc-300 text-zinc-500 flex items-center justify-center font-bold text-sm bg-white z-10'>03</div>
                        </div>
                        <div className='pb-16 flex-1'>
                            <div className='inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-bold text-emerald-700 mb-5 uppercase tracking-wider'>Go Live — 60 Seconds</div>
                            <h3 className='text-2xl font-bold text-zinc-900 mb-3'>Embed or link — automation is ON</h3>
                            <p className='text-zinc-500 font-medium leading-relaxed max-w-lg mb-8'>Copy the script tag and paste it into your website. Or scan the QR code with WhatsApp Business to link your account. Every customer message now gets an AI reply in under 2 seconds. While you sleep.</p>

                            {/* WhatsApp Chat mockup */}
                            <div className='max-w-2xl bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm'>
                                <div className='bg-white border-b border-zinc-200 px-5 py-3 flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm'>SF</div>
                                    <div>
                                        <p className='font-bold text-sm text-zinc-900'>Sharma Furniture</p>
                                        <p className='text-xs text-blue-500 font-medium'>● Powered by UseAI — Always online</p>
                                    </div>
                                </div>
                                <div className='p-5 flex flex-col gap-3'>
                                    <div className='bg-white p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-zinc-800 shadow-sm border border-zinc-100'>Red sofa ka price kya hai? 🛋️</div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold border border-blue-100'>UseAI · 96% confident · 1.8 seconds</span>
                                    </div>
                                    <div className='bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[85%] text-sm shadow-md'>
                                        Namaste! 😊 Red Oslo Sofa ₹32,999 mein available hai — abhi stock mein hai! Free delivery ₹5,000+ pe, 3 working days. Book karein? 🪑
                                    </div>
                                    <div className='bg-white p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-zinc-800 shadow-sm border border-zinc-100 mt-2'>Saturday delivery possible hai?</div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold border border-blue-100'>UseAI · 94% confident · 1.5 seconds</span>
                                    </div>
                                    <div className='bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[85%] text-sm shadow-md'>
                                        Bilkul! 🎉 Saturday 10 AM–1 PM slot available hai. Apna naam our address share karein, main confirm kar deta hoon!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pain Points Grid */}
            <section className='py-24 px-6 max-w-4xl mx-auto'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900'>What is UseAI Custom AI Chatbot?</h2>
                    <p className='text-zinc-500 mt-4 text-lg font-medium'>You're probably stuck in the following:</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {[
                        { title: "Inbox Flodded", desc: "Your inbox is flooded with repetitive customer queries.", icon: <Inbox className="w-6 h-6 text-blue-600" /> },
                        { title: "Manual Forms", desc: "You're still using boring Google Forms to capture leads.", icon: <FileText className="w-6 h-6 text-blue-600" /> },
                        { title: "Wasted Time", desc: "Your agents spend majority of their time on irrelevant questions.", icon: <Timer className="w-6 h-6 text-blue-600" /> },
                        { title: "Lost Leads", desc: "You're losing leads because you are completely unavailable after hours.", icon: <TriangleAlert className="w-6 h-6 text-blue-600" /> }
                    ].map((p, i) => (
                        <div key={i} className='bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition flex flex-col'>
                            <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4'>
                                {p.icon}
                            </div>
                            <h3 className='font-bold text-lg text-zinc-900 mb-2'>{p.title}</h3>
                            <p className='text-zinc-600 font-medium leading-relaxed'>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Product capabilities */}
            <section className='py-20 px-6 max-w-5xl mx-auto'>
                <div className='bg-white border border-zinc-200 rounded-[2.5rem] p-8 lg:p-16 grid lg:grid-cols-2 gap-16 items-center shadow-sm relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -z-10 opacity-60'></div>
                    <div>
                        <h2 className='text-3xl font-bold tracking-tight text-zinc-900'>Enter UseAI, a custom AI chatbot</h2>
                        <p className='text-zinc-500 mt-3 font-medium mb-10 text-lg'>Experience the power of a 24/7 intelligent support agent tailored to your business.</p>
                        
                        <div className='space-y-8'>
                            {[
                                { title: "Handle unlimited queries, 24x7", desc: "No more missed leads or long wait times.", icon: <Zap className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
                                { title: "Expert-level answers instantly", desc: "Trained on your business docs for 100% accuracy.", icon: <Target className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
                                { title: "Deploy everywhere", desc: "Seamlessly integrate with Website and WhatsApp.", icon: <Globe className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" }
                            ].map((item, i) => (
                                <div key={i} className='flex gap-5 items-start'>
                                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className='font-bold text-zinc-900'>{item.title}</p>
                                        <p className='text-sm text-zinc-500 font-medium'>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='mt-12 flex flex-wrap gap-2'>
                            {['Multilingual', 'Accurate', 'Personalized', 'Human-like'].map(tag => (
                                <span key={tag} className='px-4 py-1.5 bg-zinc-100 border border-zinc-200 rounded-full text-xs font-bold text-zinc-600 uppercase tracking-wider'>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className='relative hidden lg:block'>
                        <div className='absolute inset-0 bg-linear-to-tr from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl'></div>
                        <div className='bg-zinc-900 rounded-3xl p-4 shadow-2xl relative border border-zinc-800 h-[400px] flex items-center justify-center'>
                             <div className='text-center'>
                                <div className='w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/40'>
                                    <Zap className='text-white w-10 h-10' fill="currentColor" />
                                </div>
                                <p className='text-white font-bold text-2xl'>Ready to Resolve.</p>
                                <p className='text-zinc-400 mt-2'>Instant answers, zero delay.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Zig Zag - Section 1 */}
            <section className='py-24 px-6 max-w-6xl mx-auto'>
                <div className='grid lg:grid-cols-2 gap-16 lg:gap-24 items-center'>
                    <div>
                        <div className='w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20'>
                            <Timer className="w-6 h-6 text-white" />
                        </div>
                        <h2 className='text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 mb-6'>Always-On Customer Support</h2>
                        <ul className='space-y-5 mb-10'>
                            {[
                                "Handles high volumes of queries 24/7",
                                "Eliminates wait times and missed leads",
                                "Frees human agents for complex issues"
                            ].map((point, i) => (
                                <li key={i} className='flex gap-4 text-zinc-600 font-medium'>
                                    <div className='w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5'>
                                        <Zap className="w-3.5 h-3.5" fill="currentColor" />
                                    </div>
                                    {point}
                                </li>
                            ))}
                        </ul>
                        {!email && <button onClick={handleLogin} className='px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-600/20'>Request a Demo</button>}
                    </div>
                    <div className='bg-zinc-50 rounded-[3rem] p-8 lg:p-12 border border-zinc-200 relative overflow-hidden h-[500px] flex items-center justify-center shadow-inner'>
                        <div className='absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-[80px] opacity-60'></div>
                        {/* Mock Phone Graphic */}
                        <div className='relative w-72 h-[450px] bg-zinc-900 border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl p-4 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500'>
                            <div className='w-1/3 h-5 bg-zinc-800 absolute top-0 left-1/3 rounded-b-2xl z-20'></div>
                            <div className='w-full h-full bg-white rounded-[2rem] relative p-3 pt-8'>
                                <div className='flex flex-col gap-3'>
                                    <div className='bg-zinc-100 text-zinc-800 p-3 rounded-2xl rounded-tl-none text-xs font-medium w-4/5'>Hi, how can I reset my password?</div>
                                    <div className='bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-xs font-medium self-end w-4/5 shadow-md'>You can reset it by visiting app.use.ai/reset. Need help with anything else?</div>
                                    <div className='bg-zinc-100 text-zinc-800 p-3 rounded-2xl rounded-tl-none text-xs font-medium w-1/2'>Thanks! 🚀</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Zig Zag - Section 2 */}
            <section className='py-24 px-6 max-w-6xl mx-auto'>
                <div className='grid lg:grid-cols-2 gap-16 lg:gap-24 items-center'>
                    <div className='order-2 lg:order-1 bg-zinc-50 rounded-[3rem] p-8 lg:p-12 border border-zinc-200 relative overflow-hidden h-[500px] flex items-center justify-center shadow-inner'>
                        <div className='absolute bottom-0 left-0 w-40 h-40 bg-emerald-50 rounded-full blur-[80px] opacity-60'></div>
                        <div className='bg-white shadow-2xl rounded-3xl w-full h-[320px] border border-zinc-200 p-6 flex flex-col relative transform -rotate-2 hover:rotate-0 transition-transform duration-500'>
                            <div className='flex items-center gap-3 border-b border-zinc-100 pb-4 mb-6'>
                                <div className='w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-600/20'>AF</div>
                                <div>
                                    <p className='text-sm font-bold text-zinc-900'>Agarwal Fashion ✨</p>
                                    <p className='text-[10px] text-emerald-600 font-bold'>OFFICIAL BUSINESS</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <div className='bg-zinc-100 text-zinc-800 p-3 rounded-2xl rounded-tl-none text-sm font-medium w-3/4'>Hola! ¿Cómo estás hoy?</div>
                                <div className='bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none text-sm font-medium self-end w-4/5 shadow-md'>¡Hola! Todo bien. ¿Deseas hacer un pedido de moda hoy?</div>
                            </div>
                        </div>
                    </div>
                    <div className='order-1 lg:order-2'>
                        <div className='w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20'>
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h2 className='text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 mb-6'>Multilingual Conversations</h2>
                        <ul className='space-y-5 mb-10'>
                            {[
                                "Automatically detects customer language",
                                "Responds fluently and naturally in 50+ languages",
                                "Improves global customer experience instantly"
                            ].map((point, i) => (
                                <li key={i} className='flex gap-4 text-zinc-600 font-medium'>
                                    <div className='w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5'>
                                        <Zap className="w-3.5 h-3.5" fill="currentColor" />
                                    </div>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why Choose Grids */}
            <section className='py-24 px-6 max-w-5xl mx-auto border-t border-zinc-100 mt-10'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl font-bold tracking-tight text-zinc-900'>Why businesses trust UseAI?</h2>
                    <p className='text-zinc-500 font-medium mt-3 text-lg'>The most reliable AI support agent for Website and WhatsApp.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12'>
                    {[
                        { title: "24/7 Live AI Assistant", desc: "Replies instantly to incoming customer messages, even while you sleep." },
                        { title: "Multilingual Support", desc: "Understand and respond fluently in any language your customers speak." },
                        { title: "Automate 80% Support", desc: "Drastically reduce your support overhead by automating repetitive queries." },
                        { title: "Omnichannel Reach", desc: "Provide a consistent AI experience across your Website and WhatsApp." },
                        { title: "Human-in-the-loop", desc: "Review unanswered questions and train your AI to get smarter every day." },
                        { title: "Premium Experience", desc: "Delight customers with accurate, high-speed, human-like responses." }
                    ].map((f, i) => (
                        <div key={i} className='relative group'>
                            <div className='absolute -left-4 top-0 w-[1px] h-full bg-linear-to-b from-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-600/20'>{i+1}</div>
                                <h3 className='font-bold text-lg text-zinc-900'>{f.title}</h3>
                            </div>
                            <p className='text-zinc-500 text-sm leading-relaxed font-medium'>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className='py-24 px-6 max-w-6xl mx-auto'>
                <div className='bg-zinc-900 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl'>
                    <div className='absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20'></div>
                    <div className='absolute bottom-0 left-0 w-96 h-96 bg-emerald-600 rounded-full blur-[120px] opacity-20 -ml-20 -mb-20'></div>
                    
                    <div className='relative z-10'>
                        <h2 className='text-4xl lg:text-5xl font-bold mb-6 tracking-tight'>Ready to automate your support?</h2>
                        <p className='text-zinc-400 text-lg mb-12 max-w-2xl mx-auto font-medium'>Join hundreds of businesses using UseAI to resolve customer queries 24/7 without lifting a finger.</p>
                        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                            <button onClick={handleLogin} className='w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition shadow-xl shadow-blue-600/30'>
                                {loading ? 'One moment...' : 'Start for Free'}
                            </button>
                            <button className='w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition border border-zinc-700'>
                                Book a Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section className='py-24 px-6 max-w-3xl mx-auto'>
                <div className='bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-xl'>
                    <h2 className='text-2xl font-bold text-center mb-2'>Help Us Improve</h2>
                    <p className='text-zinc-500 text-sm text-center mb-10'>Rate us and tell us what to add or what's not working!</p>
                    
                    {reviewSuccess ? (
                        <div className='text-center py-10 bg-green-50 rounded-2xl border border-green-100'>
                            <div className='text-4xl mb-4'>🎉</div>
                            <h3 className='text-lg font-bold text-green-800'>Thank you for your feedback!</h3>
                            <button onClick={() => setReviewSuccess(false)} className='mt-6 px-6 py-2 text-sm bg-white border border-zinc-200 rounded-lg shadow-sm hover:bg-zinc-50 transition font-medium'>Submit another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleReviewSubmit} className='space-y-8'>
                            <div className='flex flex-col items-center gap-4'>
                                <label className='text-sm font-bold text-zinc-700 uppercase tracking-widest'>Select Rating</label>
                                <div className='flex justify-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)}
                                            className={`text-4xl transition-all ${rating >= star ? 'text-amber-400 scale-110' : 'text-zinc-300 hover:text-amber-200 hover:scale-110 drop-shadow-sm'}`}>
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Type your feature requests or bug reports here..."
                                    className='w-full h-32 bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-zinc-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none font-medium placeholder:text-zinc-400'
                                    required
                                />
                            </div>
                            
                            <button type="submit" disabled={submittingReview || rating === 0 || !feedback.trim()}
                                className='w-full py-4 rounded-xl bg-black text-white font-bold text-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg'>
                                {submittingReview ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className='py-12 border-t border-zinc-200 bg-white text-center'>
                <div className='text-xl font-bold tracking-tight mb-4'>Use<span className='text-blue-600'>.ai</span></div>
                <p className='text-sm font-medium text-zinc-500 mb-2'>&copy; {new Date().getFullYear()} UseAI. All rights reserved.</p>
                <p className='text-sm font-medium text-zinc-500'>Support: <a href="mailto:shikhar482006@gmail.com" className='text-blue-600 hover:underline'>shikhar482006@gmail.com</a></p>
            </footer>
        </div>
    )
}
