'use client'
import React from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import {
    Brain,
    BarChart2,
    Zap,
    LayoutDashboard,
    Layers,
    RefreshCw,
    UserCheck,
    ArrowLeft,
    Check,
    ArrowRight,
} from 'lucide-react'

const features = [
    {
        num: '01',
        Icon: Brain,
        accentBg: 'bg-blue-50',
        accentText: 'text-blue-600',
        accentBorder: 'border-blue-100',
        accentDot: 'bg-blue-500',
        title: 'AI Assistant',
        tagline: 'Your 24/7 AI receptionist',
        desc: 'Never miss a customer again. Your AI assistant is trained on your business in under a minute and instantly responds with accurate, human-like conversations.',
        bullets: [
            'Train using your website, PDF, or business data',
            'Instantly answers questions about pricing, services, and policies',
            'Understands natural language — not just keywords',
            'Supports 50+ languages out of the box',
            'No buttons or scripts — just real, intelligent conversations',
        ],
        cta: 'Like having a receptionist who works 24/7, never gets tired, and never misses a lead.',
    },
    {
        num: '02',
        Icon: BarChart2,
        accentBg: 'bg-emerald-50',
        accentText: 'text-emerald-600',
        accentBorder: 'border-emerald-100',
        accentDot: 'bg-emerald-500',
        title: 'Conversation Intelligence',
        tagline: 'Turn every conversation into business insight',
        desc: 'Every customer message is analyzed in real-time to understand intent, urgency, and opportunity. No more guessing who is serious — your AI knows.',
        bullets: [
            'Detects buying intent, inquiries, and complaints instantly',
            'Extracts key details like name, budget, and urgency',
            'Identifies hot leads vs casual conversations',
            'Converts unstructured chats into clean, usable data',
            'Gives you actionable insights from every conversation',
        ],
        cta: 'Like having a sales analyst listening to every chat and telling you exactly what matters.',
    },
    {
        num: '03',
        Icon: Zap,
        accentBg: 'bg-amber-50',
        accentText: 'text-amber-600',
        accentBorder: 'border-amber-100',
        accentDot: 'bg-amber-500',
        title: 'Action Automation',
        tagline: 'From conversation to conversion — automatically',
        desc: "Your AI doesn't just respond — it takes action. From bookings to follow-ups, everything happens instantly without manual effort.",
        bullets: [
            'Automatically books appointments (Calendly, Google Calendar, etc.)',
            'Sends confirmations and updates in real-time',
            'Pushes lead data directly to your CRM or email',
            'Triggers smart follow-ups based on customer behavior',
            'Connects seamlessly with Google Sheets and email',
        ],
        cta: 'No delays. No manual work. Just instant execution.',
    },
    {
        num: '04',
        Icon: LayoutDashboard,
        accentBg: 'bg-violet-50',
        accentText: 'text-violet-600',
        accentBorder: 'border-violet-100',
        accentDot: 'bg-violet-500',
        title: 'Business Dashboard',
        tagline: 'Your business, in real-time',
        desc: 'Get complete visibility into your customer interactions, leads, and revenue — all in one place.',
        bullets: [
            'Track leads, conversations, and conversions live',
            'See which channels bring the best customers',
            'Understand what customers are asking most',
            'Monitor performance metrics without spreadsheets',
            'Make data-driven decisions instantly',
        ],
        cta: 'Like having a live business report that updates itself.',
    },
    {
        num: '05',
        Icon: Layers,
        accentBg: 'bg-cyan-50',
        accentText: 'text-cyan-600',
        accentBorder: 'border-cyan-100',
        accentDot: 'bg-cyan-500',
        title: 'Multi-Channel',
        tagline: 'One AI. Every platform.',
        desc: 'Train your AI once and deploy it everywhere your customers are.',
        bullets: [
            'Works across WhatsApp, Instagram, and your website',
            'Centralized dashboard for all conversations',
            'Consistent AI personality and responses across channels',
            'No need to switch between multiple apps',
        ],
        cta: 'One brain powering your entire customer communication.',
    },
    {
        num: '06',
        Icon: Brain,
        accentBg: 'bg-pink-50',
        accentText: 'text-pink-600',
        accentBorder: 'border-pink-100',
        accentDot: 'bg-pink-500',
        title: 'AI Memory & Learning',
        tagline: 'Gets smarter with every interaction',
        desc: 'Your AI continuously learns from conversations and improves over time — specifically for your business.',
        bullets: [
            'Remembers past conversations and customer context',
            'Learns instantly from your corrections',
            'Adapts to your business style and preferences',
            'Improves accuracy and responses over time',
            'Never forgets, never degrades',
        ],
        cta: 'The more you use it, the better it gets.',
    },
    {
        num: '07',
        Icon: RefreshCw,
        accentBg: 'bg-orange-50',
        accentText: 'text-orange-600',
        accentBorder: 'border-orange-100',
        accentDot: 'bg-orange-500',
        title: 'Lead Recovery',
        tagline: "Recover leads you didn't even know you lost",
        desc: 'Most businesses lose 60–70% of potential customers due to missed follow-ups. Your AI ensures that never happens.',
        bullets: [
            'Automatically detects inactive or dropped leads',
            'Sends personalized follow-up messages at the right time',
            'Re-engages customers without sounding robotic',
            'Works 24/7 without manual intervention',
        ],
        cta: 'Turn missed opportunities into conversions — automatically.',
    },
    {
        num: '08',
        Icon: UserCheck,
        accentBg: 'bg-rose-50',
        accentText: 'text-rose-600',
        accentBorder: 'border-rose-100',
        accentDot: 'bg-rose-500',
        title: 'Human + AI Collaboration',
        tagline: 'AI handles the routine. You handle the critical.',
        desc: 'Your AI manages most conversations, but you stay in control whenever needed.',
        bullets: [
            'AI alerts you when human intervention is required',
            'Instantly take over any conversation',
            'Get AI-suggested replies you can approve or edit',
            'Every correction improves future responses',
        ],
        cta: 'The perfect balance between automation and control.',
    },
]

export default function RoadmapClient() {
    return (
        <div className='min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-800'>

            {/* Top Nav */}
            <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100'>
                <div className='max-w-6xl mx-auto px-6 h-14 flex items-center justify-between'>
                    <Link href='/' className='text-lg font-bold tracking-tight'>
                        Use<span className='text-blue-600'>Converra</span>
                    </Link>
                    <div className='flex items-center gap-6'>
                        <Link href='/' className='inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition'>
                            <ArrowLeft className='w-3.5 h-3.5' />
                            Back to Home
                        </Link>
                        <Link href='/login' className='inline-flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl'>
                            Get Started
                            <ArrowRight className='w-3.5 h-3.5' />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className='pt-20 pb-16 px-6 border-b border-zinc-100'>
                <div className='max-w-4xl mx-auto text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 uppercase tracking-widest mb-8'>
                            <span className='w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse' />
                            Product Roadmap
                        </div>
                        <h1 className='text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-900'>
                            What we&apos;re building<br />
                            <span className='text-blue-600'>next</span>
                        </h1>
                        <p className='mt-6 text-zinc-500 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed'>
                            UseConverra is evolving fast. Here&apos;s a detailed look at every feature we&apos;re shipping — built to make your business unstoppable.
                        </p>
                    </motion.div>

                    {/* Feature count strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className='mt-12 flex flex-wrap items-center justify-center gap-3'
                    >
                        {features.map((f) => (
                            <a
                                key={f.num}
                                href={`#feature-${f.num}`}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${f.accentBorder} ${f.accentBg} ${f.accentText} text-xs font-bold hover:shadow-sm transition`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${f.accentDot}`} />
                                {f.num} {f.title}
                            </a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className='py-16 px-6'>
                <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {features.map((feature, i) => {
                        const { Icon } = feature
                        return (
                            <motion.div
                                id={`feature-${feature.num}`}
                                key={feature.num}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: i * 0.04 }}
                                viewport={{ once: true }}
                                className='group relative bg-white border border-zinc-200 rounded-3xl p-8 hover:border-zinc-300 hover:shadow-xl transition-all duration-400 overflow-hidden'
                            >
                                {/* Ghost number watermark */}
                                <div className='absolute bottom-4 right-6 text-[7rem] font-black text-zinc-50 select-none pointer-events-none leading-none'>
                                    {feature.num}
                                </div>

                                {/* Card header */}
                                <div className='flex items-start gap-4 mb-5 relative'>
                                    <div className={`w-11 h-11 rounded-2xl ${feature.accentBg} border ${feature.accentBorder} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-5 h-5 ${feature.accentText}`} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <div className={`text-[10px] font-black uppercase tracking-[0.15em] ${feature.accentText} mb-0.5`}>
                                            {feature.num}
                                        </div>
                                        <h2 className='text-lg font-bold text-zinc-900 leading-snug'>
                                            {feature.title}
                                        </h2>
                                        <p className='text-sm text-zinc-500 font-medium mt-0.5'>{feature.tagline}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className='text-zinc-600 text-sm leading-relaxed mb-5 font-medium relative'>
                                    {feature.desc}
                                </p>

                                {/* Bullets */}
                                <ul className='space-y-2.5 mb-6 relative'>
                                    {feature.bullets.map((b, j) => (
                                        <li key={j} className='flex items-start gap-2.5 text-sm text-zinc-700 font-medium'>
                                            <span className={`mt-0.5 w-4 h-4 rounded-full ${feature.accentBg} border ${feature.accentBorder} flex items-center justify-center shrink-0`}>
                                                <Check className={`w-2.5 h-2.5 ${feature.accentText}`} strokeWidth={3} />
                                            </span>
                                            {b}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA quote */}
                                <div className={`relative border-t border-zinc-100 pt-5 text-xs font-semibold ${feature.accentText} leading-relaxed`}>
                                    {feature.cta}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className='py-20 px-6 border-t border-zinc-100'>
                <div className='max-w-3xl mx-auto text-center'>
                    <h2 className='text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 mb-4'>
                        Want early access to these features?
                    </h2>
                    <p className='text-zinc-500 text-lg font-medium mb-8 max-w-xl mx-auto'>
                        Join hundreds of businesses automating their customer support with UseConverra today.
                    </p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                        <Link href='/login' className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/20'>
                            Get Started Free
                            <ArrowRight className='w-4 h-4' />
                        </Link>
                        <Link href='/' className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-sm font-bold px-8 py-3.5 rounded-2xl transition'>
                            <ArrowLeft className='w-4 h-4' />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className='py-8 border-t border-zinc-100 text-center'>
                <div className='text-base font-bold tracking-tight mb-1'>
                    Use<span className='text-blue-600'>Converra</span>
                </div>
                <p className='text-xs text-zinc-400 font-medium'>
                    &copy; {new Date().getFullYear()} UseConverra. All rights reserved.
                </p>
            </footer>
        </div>
    )
}
