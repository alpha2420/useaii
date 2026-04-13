'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { HeroLanding } from '@/components/ui/hero-1'
import { Inbox, FileText, Timer, TriangleAlert, Zap, Target, Globe, MessageCircle, MessageSquare, Smartphone, Check } from 'lucide-react'

const featureSections = [
    {
        title: "Always-On Customer Support",
        points: [
            "Handles high volumes of queries 24/7",
            "Eliminates wait times and missed leads",
            "Frees human agents for complex issues"
        ],
        image: "/chat_mockup_1_1775460073772.png"
    },
    {
        title: "Multilingual Conversations",
        points: [
            "Automatically detects customer language",
            "Responds fluently and naturally",
            "Improves global customer experience"
        ],
        image: "/chat_mockup_multilingual_1775460094640.png"
    },
    {
        title: "Action-Driven AI Workflows",
        points: [
            "Understands real customer intent",
            "Connects with your internal systems",
            "Executes tasks, not just answers questions"
        ],
        image: "/workflow_mockup_1775460111614.png"
    },
    {
        title: "Scale Without Expanding Your Team",
        points: [
            "Manages growing query volumes effortlessly",
            "Reduces dependency on manual support",
            "Maintains consistent service quality"
        ],
        image: "/chart_growth_1775460132037.png"
    },
    {
        title: "Instant, No-Code Deployment",
        points: [
            "No APIs or technical setup required",
            "Add your business information",
            "Go live within minutes"
        ],
        image: "/deployment_hub_1775460149159.png"
    },
    {
        title: "Continuous Learning & Improvement",
        points: [
            "Centralized conversation dashboard",
            "Identify answered and unanswered queries",
            "Train the AI to improve future responses"
        ],
        image: "/chart_analytics_1775460170434.png"
    }
];
export default function HomeClient({ email }: { email: string }) {
    const [loading, setLoading] = useState(false)
    const navigate = useRouter()
    
    const handleLogin = () => {
        setLoading(true)
        navigate.push("/login")
    }
    
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
                    { 
                        name: 'Use Cases', 
                        dropdown: [
                            { title: 'Flows', desc: 'Trigger → condition → action automations', href: '#' },
                            { title: 'Autopilot', desc: 'AI WhatsApp bot for your customers', href: '#' },
                            { title: 'Conversational CRM', desc: 'Turn WhatsApp chats into a sales pipeline', href: '#' },
                            { title: 'Campaigns', desc: 'Broadcast, trigger & drip sequences', href: '#' },
                            { title: 'Expense Tracking', desc: 'Track team expenses from WhatsApp', href: '#' }
                        ]
                    },
                    { name: 'Pricing', href: '#' },
                    { name: 'Features', href: '#features' },
                    { name: 'Roadmap', href: '/roadmap' },
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
                                    <div className='bg-white p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-zinc-800 shadow-sm border border-zinc-100'>Red sofa ka price kya hai? </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold border border-blue-100'>UseAI · 96% confident · 1.8 seconds</span>
                                    </div>
                                    <div className='bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[85%] text-sm shadow-md'>
                                        Namaste!  Red Oslo Sofa ₹32,999 mein available hai — abhi stock mein hai! Free delivery ₹5,000+ pe, 3 working days. Book karein? 
                                    </div>
                                    <div className='bg-white p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-zinc-800 shadow-sm border border-zinc-100 mt-2'>Saturday delivery possible hai?</div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold border border-blue-100'>UseAI · 94% confident · 1.5 seconds</span>
                                    </div>
                                    <div className='bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[85%] text-sm shadow-md'>
                                        Bilkul!  Saturday 10 AM–1 PM slot available hai. Apna naam our address share karein, main confirm kar deta hoon!
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
                    <p className='text-zinc-500 mt-4 text-lg font-medium'>You&apos;re probably stuck in the following:</p>
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

            {/* Platforms Selection Section */}
            <section className='py-24 px-6 max-w-6xl mx-auto border-t border-zinc-100 mt-10'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900'>
                        Platforms Where You Can Use UseAI
                    </h2>
                    <p className='text-zinc-500 mt-4 text-lg font-medium'>
                        Seamlessly Integrate and automate across multiple platforms
                    </p>
                </div>

                <div className='relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 lg:h-[600px]'>
                    {/* Central Illustration */}
                    <div className='relative z-10 w-full max-w-md lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 flex justify-center'>
                        <div className='relative'>
                            <div className='absolute -inset-4 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10 animate-pulse'></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src="/platform_illustration.png" 
                                alt="Platform Illustration" 
                                className='w-full max-w-[400px] h-auto object-contain mix-blend-multiply'
                            />
                        </div>
                    </div>

                    {/* Feature Cards - Left Side */}
                    <div className='flex flex-col gap-6 w-full lg:w-auto lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:z-20'>
                        {/* Website Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className='bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full lg:w-[260px] lg:-translate-y-8 lg:-translate-x-4 group cursor-default'
                        >
                            <div className='w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                <Globe className="w-4 h-4 text-zinc-900" />
                            </div>
                            <h3 className='font-bold text-base text-zinc-900 mb-2'>Website</h3>
                            <p className='text-zinc-500 font-medium text-xs leading-relaxed'>
                                Have your AI Agent provide live support over your website 24/7.
                            </p>
                        </motion.div>

                        {/* WhatsApp Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className='bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full lg:w-[260px] lg:translate-x-8 lg:translate-y-8 group cursor-default'
                        >
                            <div className='w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                <MessageCircle className="w-4 h-4 text-zinc-900" />
                            </div>
                            <h3 className='font-bold text-base text-zinc-900 mb-2'>WhatsApp</h3>
                            <p className='text-zinc-500 font-medium text-xs leading-relaxed'>
                                Turn your mobile WhatsApp into a full-fledged AI chatbot that talks like you.
                            </p>
                        </motion.div>
                    </div>

                    {/* Feature Cards - Right Side */}
                    <div className='flex flex-col gap-6 w-full lg:w-auto lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:z-20'>
                        {/* WhatsApp API Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className='bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full lg:w-[260px] lg:-translate-y-8 lg:translate-x-4 group cursor-default'
                        >
                            <div className='w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                <MessageSquare className="w-4 h-4 text-zinc-900" />
                            </div>
                            <h3 className='font-bold text-base text-zinc-900 mb-2'>WhatsApp API</h3>
                            <p className='text-zinc-500 font-medium text-xs leading-relaxed'>
                                Connect WhatsApp API, send campaigns, and let UseAI handle interested customer queries.
                            </p>
                        </motion.div>

                        {/* Applications Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className='bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full lg:w-[260px] lg:-translate-x-8 lg:translate-y-8 group cursor-default self-end lg:self-auto'
                        >
                            <div className='w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                <Smartphone className="w-4 h-4 text-zinc-900" />
                            </div>
                            <h3 className='font-bold text-base text-zinc-900 mb-2'>Applications</h3>
                            <p className='text-zinc-500 font-medium text-xs leading-relaxed'>
                                Train UseAI and offer in-app support so customers get help without leaving.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How Our Custom AI Chatbot Helps Business Section */}
            <section className='py-24 px-6 max-w-6xl mx-auto'>
                <div className='text-center mb-24'>
                    <h2 className='text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900'>
                        How Our Custom AI Chatbot Helps Business
                    </h2>
                    <p className='text-zinc-500 mt-4 text-xg lg:text-lg font-medium'>
                        Built to reduce workload, improve response time, and scale support effortlessly.
                    </p>
                </div>

                <div className='flex flex-col gap-24 lg:gap-32'>
                    {featureSections.map((section, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={index} className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center`}>
                                {/* Text Content */}
                                <div className={`order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <h3 className='text-3xl font-bold tracking-tight text-zinc-900 mb-6'>
                                        {section.title}
                                    </h3>
                                    <ul className='space-y-4 mb-8'>
                                        {section.points.map((point, i) => (
                                            <li key={i} className='flex gap-3 text-sm lg:text-base text-zinc-600 font-medium items-center'>
                                                <div className='w-5 h-5 rounded flex items-center justify-center shrink-0 bg-zinc-100 text-zinc-900'>
                                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                                </div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                    {!email && (
                                        <button onClick={handleLogin} className='px-6 py-3 rounded-xl bg-blue-600 text-sm text-white font-bold hover:bg-blue-700 transition'>
                                            Request a Demo
                                        </button>
                                    )}
                                </div>

                                {/* Graphic Content */}
                                <div className={`order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'} flex justify-center`}>
                                    <div className='w-full max-w-lg bg-zinc-50 rounded-3xl p-6 lg:p-10 border border-zinc-100 flex items-center justify-center relative overflow-hidden'>
                                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full blur-[80px] opacity-60'></div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={section.image} 
                                            alt={section.title} 
                                            className='relative z-10 w-full h-auto object-contain drop-shadow-sm hover:-translate-y-1 transition-transform duration-500'
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                    <p className='text-zinc-500 text-sm text-center mb-10'>Rate us and tell us what to add or what&apos;s not working!</p>
                    
                    {reviewSuccess ? (
                        <div className='text-center py-10 bg-green-50 rounded-2xl border border-green-100'>
                            <div className='text-4xl mb-4'></div>
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
