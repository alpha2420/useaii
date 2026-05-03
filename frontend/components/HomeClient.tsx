// @ts-nocheck
'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeClient({ email }: { email?: string }) {
    const router = useRouter()

    const handleLogin = () => {
        router.push(email ? "/dashboard" : "/login")
    }

    useEffect(() => {

        const industryData = {
            'real-estate': {
                title: 'Automate Property Inquiries & Lead Qualification',
                bullets: [
                    'Instantly answer questions about pricing, floor plans, and availability.',
                    'Automatically schedule site visits and collect contact details.',
                    'Pre-qualify leads based on budget, location preference, and urgency.'
                ],
                chat: [
                    { type: 'user', text: 'Hi, do you have 3BHK apartments near downtown under $500k?' },
                    { type: 'bot', text: "Hello! Yes, we have two premium 3BHK properties available downtown. 'Skyline Heights' starts at $450k. Would you like me to share the brochure or schedule a site visit?" }
                ]
            },
            'healthcare': {
                title: 'Streamline Patient Booking & FAQs',
                bullets: [
                    'Book, reschedule, or cancel appointments 24/7 without front-desk delays.',
                    'Answer routine questions about insurance, clinic hours, and services.',
                    'Send automated reminders and preparation instructions to patients.'
                ],
                chat: [
                    { type: 'user', text: 'I need to book a dental consultation for tomorrow. Do you accept BlueCross?' },
                    { type: 'bot', text: 'Yes, we accept BlueCross insurance! We have an opening tomorrow at 10:00 AM or 2:30 PM with Dr. Smith. Which time works better for you?' }
                ]
            },
            'education': {
                title: 'Simplify Admissions & Student Support',
                bullets: [
                    'Guide prospective students through courses, fees, and admission criteria.',
                    'Automate document collection and application status updates.',
                    'Provide instant answers for campus facilities, hostels, and scholarships.'
                ],
                chat: [
                    { type: 'user', text: 'What is the deadline for the MBA program, and what are the fees?' },
                    { type: 'bot', text: 'The deadline for the Fall MBA intake is August 15th. Total tuition fee is $45,000. Would you like me to send you the application link and scholarship details?' }
                ]
            },
            'travel': {
                title: '24/7 Booking Assistant & Itinerary Planning',
                bullets: [
                    'Help customers find flights, hotels, and holiday packages instantly.',
                    'Automate booking modifications, cancellations, and refund queries.',
                    'Provide local recommendations, visa requirements, and baggage policies.'
                ],
                chat: [
                    { type: 'user', text: 'Looking for a 4-day trip to Bali in December. Budget is $1500.' },
                    { type: 'bot', text: 'Great choice! I found a 4-night stay at a 4-star resort in Seminyak, including flights, for $1,350 total. Should I send you the detailed itinerary?' }
                ]
            },
            'logistics': {
                title: 'Real-time Tracking & Customer Support',
                bullets: [
                    'Provide instant, automated updates on shipment tracking and delivery status.',
                    'Handle return requests, damage claims, and rescheduling automatically.',
                    'Reduce support tickets by answering shipping policy FAQs instantly.'
                ],
                chat: [
                    { type: 'user', text: 'Where is my package #TRK98765? It was supposed to be here yesterday.' },
                    { type: 'bot', text: 'I apologize for the delay. Your package #TRK98765 is currently out for delivery and will arrive today by 6:00 PM. Would you like an SMS alert when it arrives?' }
                ]
            }
        };

        setTimeout(() => {
            const tabs = document.querySelectorAll('.industry-tab');
            const titleEl = document.getElementById('industry-title');
            const ulEl = document.getElementById('industry-bullets');
            const chatEl = document.getElementById('industry-chat');
            const textContainer = document.getElementById('industry-text-container');
            const chatContainer = document.getElementById('industry-chat-container');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Update active state
                    tabs.forEach(t => {
                        t.classList.remove('bg-[#111827]', 'text-white');
                        t.classList.add('bg-transparent', 'text-gray-500', 'hover:bg-gray-100', 'hover:text-gray-900');
                    });
                    tab.classList.remove('bg-transparent', 'text-gray-500', 'hover:bg-gray-100', 'hover:text-gray-900');
                    tab.classList.add('bg-[#111827]', 'text-white');

                    // Update content with animation
                    const key = tab.getAttribute('data-target');
                    if (!key) return;
                    
                    const data = industryData[key];
                    if (!data) return;

                    if (textContainer) textContainer.style.opacity = "0";
                    if (chatContainer) chatContainer.style.opacity = "0";

                    setTimeout(() => {
                        if (titleEl) titleEl.textContent = data.title;
                        
                        if (ulEl) ulEl.innerHTML = data.bullets.map((b: string) => `
                            <li class="flex items-start gap-3">
                                <div class="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></div>
                                <span class="text-gray-600 text-[15px] leading-relaxed">${b}</span>
                            </li>
                        `).join('');

                        if (chatEl) chatEl.innerHTML = data.chat.map((msg: any) => {
                            if (msg.type === 'user') {
                                return `
                                <div class="self-end max-w-[85%] bg-[#D9FDD3] text-gray-900 rounded-lg rounded-tr-none px-3 pt-2 pb-1.5 text-[14px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] relative">
                                    ${msg.text}
                                    <div class="flex items-center justify-end gap-1 mt-1">
                                        <span class="text-[10px] text-gray-500 leading-none">10:42 AM</span>
                                        <svg class="w-3.5 h-3.5 text-[#53bdeb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <svg class="absolute top-0 right-[-8px] text-[#D9FDD3]" width="8" height="13" viewBox="0 0 8 13"><path d="M5.188 1H0v11.142l4.606-4.502A5.132 5.132 0 008 4.04V1H5.188z" fill="currentColor"/></svg>
                                </div>`;
                            } else {
                                return `
                                <div class="self-start max-w-[85%] bg-white text-gray-900 rounded-lg rounded-tl-none px-3 pt-2 pb-1.5 text-[14px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] relative leading-relaxed">
                                    ${msg.text}
                                    <div class="flex items-center justify-end gap-1 mt-1">
                                        <span class="text-[10px] text-gray-500 leading-none">10:42 AM</span>
                                    </div>
                                    <svg class="absolute top-0 left-[-8px] text-white" width="8" height="13" viewBox="0 0 8 13"><path d="M2.812 1H8v11.142L3.394 7.64A5.132 5.132 0 010 4.04V1h2.812z" fill="currentColor"/></svg>
                                </div>`;
                            }
                        }).join('');
                        
                        if (textContainer) textContainer.style.opacity = "1";
                        if (chatContainer) chatContainer.style.opacity = "1";
                    }, 300);
                });
            });
        });

        const conversations = [
            {
                name: "Rahul Sharma",
                msgs: [
                    { type: "in", text: "Hi! I need to book a 2-bedroom apartment urgently for next week. My budget is $1,200 max.", time: "14:24" },
                    { type: "out", text: "I can help! We have 3 properties matching your $1,200 budget. I've tagged our agent to send virtual tours right away.", time: "14:24" }
                ],
                chip: { intent: "Booking", budget: "$1,200", lead: "Hot", lang: "English" }
            },
            {
                name: "Priya Verma",
                msgs: [
                    { type: "in", text: "नमस्ते! मुझे अपने बिज़नेस के लिए CRM सॉफ्टवेयर चाहिए। क्या आप मुझे प्राइसिंग बता सकते हैं?", time: "10:15" },
                    { type: "out", text: "नमस्ते प्रिया जी! बिल्कुल। हमारा बिज़नेस प्लान ₹2,999/महीने से शुरू होता है। मैंने आपकी डिटेल्स हमारी सेल्स टीम को भेज दी हैं।", time: "10:15" }
                ],
                chip: { intent: "CRM Purchase", budget: "₹2,999+", lead: "Hot", lang: "Hindi" }
            },
            {
                name: "Amit Patel",
                msgs: [
                    { type: "in", text: "Hello bhai, mujhe ek bulk order place karna hai. Around 500 units chahiye, price kya hoga?", time: "18:42" },
                    { type: "out", text: "Hi Amit! 500 units ke liye bulk pricing ₹450/unit hogi (regular ₹599). Maine aapka order detail sales team ko forward kar diya hai, wo 10 min mein call karenge.", time: "18:42" }
                ],
                chip: { intent: "Bulk Order", budget: "₹2.25L", lead: "Hot", lang: "Hinglish" }
            }
        ];

        let currentConv = 0;
        let convTimeouts = [];

        function makeBubble(msg) {
            const isIn = msg.type === 'in';
            const wrapper = document.createElement('div');
            wrapper.className = 'chat-bubble max-w-[85%] relative ' + (isIn ? 'self-start wa-tail-in' : 'self-end wa-tail-out');
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.style.backgroundColor = isIn ? '#FFFFFF' : '#D9FDD3';
            bubbleDiv.className = 'text-gray-800 p-2 shadow-sm text-[11px] leading-relaxed ' + (isIn ? 'rounded-lg rounded-tl-none' : 'rounded-lg rounded-tr-none');
            
            const textNode = document.createTextNode(msg.text + ' ');
            bubbleDiv.appendChild(textNode);
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'text-[9px] float-right ml-2 mt-1 inline-flex items-center gap-0.5 ' + (isIn ? 'text-gray-400' : 'text-gray-500');
            timeSpan.textContent = msg.time;
            
            if (!isIn) {
                timeSpan.innerHTML = msg.time + ' <svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>';
            }
            
            bubbleDiv.appendChild(timeSpan);
            wrapper.appendChild(bubbleDiv);
            return wrapper;
        }

        function makeTyping() {
            const el = document.createElement('div');
            el.className = 'chat-bubble self-end';
            el.id = 'typing-el';
            const inner = document.createElement('div');
            inner.style.backgroundColor = '#D9FDD3';
            inner.className = 'px-4 py-3 rounded-lg shadow-sm flex gap-1.5 items-center';
            inner.innerHTML = '<div class="w-2 h-2 bg-gray-400 rounded-full d1"></div><div class="w-2 h-2 bg-gray-400 rounded-full d2"></div><div class="w-2 h-2 bg-gray-400 rounded-full d3"></div>';
            el.appendChild(inner);
            return el;
        }

        function runConversation() {
            // Clear any previous timeouts to prevent duplicates
            convTimeouts.forEach(id => clearTimeout(id));
            convTimeouts = [];

            const chatArea = document.getElementById('chat-area');
            if (!chatArea) return;

            const conv = conversations[currentConv];
            chatArea.innerHTML = '';
            
            const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
            setText('contact-name', conv.name);
            setText('chip-intent', '—');
            setText('chip-budget', '—');
            setText('chip-lead', '—');
            setText('chip-lang', '—');
            
            const crmChip = document.getElementById('crm-chip');
            if (crmChip) crmChip.classList.remove('show');

            // 1. Show customer message
            const inMsg = makeBubble(conv.msgs[0]);
            chatArea.appendChild(inMsg);
            convTimeouts.push(setTimeout(() => inMsg.classList.add('show'), 600));

            // 2. Show typing
            const typingEl = makeTyping();
            convTimeouts.push(setTimeout(() => { 
                const ca = document.getElementById('chat-area');
                if (ca) {
                    ca.appendChild(typingEl); 
                    setTimeout(() => typingEl.classList.add('show'), 50); 
                }
            }, 2000));

            // 3. Show CRM chip data
            convTimeouts.push(setTimeout(() => {
                const chip = document.getElementById('crm-chip');
                if (chip) chip.classList.add('show');
                setText('chip-intent', conv.chip.intent);
                setText('chip-budget', conv.chip.budget);
                setText('chip-lead', conv.chip.lead);
                setText('chip-lang', conv.chip.lang);
                setText('lead-detail', conv.name + ' — Budget ' + conv.chip.budget);
            }, 3000));

            // 4. Replace typing with AI reply
            convTimeouts.push(setTimeout(() => {
                const t = document.getElementById('typing-el');
                if (t) t.remove();
                const outMsg = makeBubble(conv.msgs[1]);
                const ca = document.getElementById('chat-area');
                if (ca) {
                    ca.appendChild(outMsg);
                    setTimeout(() => outMsg.classList.add('show'), 50);
                }
            }, 4200));

            // 5. Next conversation after pause
            convTimeouts.push(setTimeout(() => {
                currentConv = (currentConv + 1) % conversations.length;
                runConversation();
            }, 9000));
        }

        // Left Column Feature Animation
        // Left Column Feature Animation
        const featureJobs = [
            { 
                title: 'Scale Without Expanding', 
                desc: 'Handle massive query volumes with zero extra staff. Converra acts as your tireless digital workforce.', 
                visId: 'vis-0',
                checks: ['No additional headcount required', 'Handles 10k+ concurrent queries', 'Maintains 99.9% uptime']
            },
            { 
                title: 'Instant Lead Qualification', 
                desc: 'Automatically identify high-intent prospects before they bounce with our AI scoring engine.', 
                visId: 'vis-1',
                checks: ['Automatically scores prospects', 'Intelligently qualifies leads', 'Routes hot leads to humans']
            },
            { 
                title: 'Seamless CRM Integration', 
                desc: 'Push leads, notes, and chat transcripts directly to HubSpot or Salesforce instantly.', 
                visId: 'vis-2',
                checks: ['Bi-directional HubSpot sync', 'Auto-logs chat transcripts', 'Updates fields in real-time']
            },
            { 
                title: 'Multilingual AI Engine', 
                desc: 'Speak your customers\' language natively with perfect cultural context across 100+ languages.', 
                visId: 'vis-3',
                checks: ['Native 100+ language support', 'Understands cultural nuances', 'Auto-detects user language']
            }
        ];
        // Initialize the first one on load
        document.getElementById('feature-checks').innerHTML = featureJobs[0].checks.map(check => 
            `<li class="flex items-center gap-3 text-[14px] font-bold text-gray-800"><div class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>${check}</li>`
        ).join('');

        let featureIdx = 0;

        function cycleFeatureJob() {
            const timerBar = document.getElementById('feature-timer-bar');
            const counter = document.getElementById('feature-counter');
            if (!timerBar) return;
            
            const titleEl = document.getElementById('feature-title');
            const descEl = document.getElementById('feature-desc');
            const checksEl = document.getElementById('feature-checks');
            const textContainer = document.getElementById('feature-text-container');
            
            textContainer.style.opacity = '0';
            
            for(let i=0; i<4; i++) {
                const vis = document.getElementById('vis-' + i);
                if(vis) {
                    vis.style.opacity = '0';
                    vis.style.pointerEvents = 'none';
                }
            }
            
            setTimeout(() => {
                featureIdx = (featureIdx + 1) % featureJobs.length;
                const job = featureJobs[featureIdx];
                
                titleEl.innerText = job.title;
                descEl.innerText = job.desc;
                counter.innerText = (featureIdx + 1) + " / 4";
                
                if (checksEl) {
                    checksEl.innerHTML = job.checks.map(check => 
                        `<li class="flex items-center gap-3 text-[14px] font-bold text-gray-800"><div class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>${check}</li>`
                    ).join('');
                }
                
                const vis = document.getElementById(job.visId);
                if(vis) {
                    vis.style.opacity = '1';
                    vis.style.pointerEvents = 'auto';
                }
                
                timerBar.style.transition = 'none';
                timerBar.style.width = '100%';
                
                textContainer.style.opacity = '1';
                
                setTimeout(() => {
                    timerBar.style.transition = 'width 3.7s linear';
                    timerBar.style.width = '0%';
                }, 50);
                
            }, 300);
        }
        
        setInterval(cycleFeatureJob, 4000);

        // Action-Driven Workflows Animation
        const actionJobs = [
            { msg: '"I need to cancel my order #9982"', intent: 'CANCEL ORDER', exec: 'API Executed', color: 'text-green-600', bgColor: 'bg-green-50' },
            { msg: '"Can I schedule a demo for Tuesday?"', intent: 'BOOK DEMO', exec: 'Calendar Synced', color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { msg: '"My payment failed, please help"', intent: 'PAYMENT SUPPORT', exec: 'Ticket Created', color: 'text-orange-600', bgColor: 'bg-orange-50' }
        ];
        let actionJobIdx = 0;
        
        function cycleActionJob() {
            const container = document.getElementById('action-animation-container');
            const timerBar = document.getElementById('action-timer-bar');
            if (!container || !timerBar) return;
            
            // Fade out
            container.style.opacity = '0';
            
            setTimeout(() => {
                actionJobIdx = (actionJobIdx + 1) % actionJobs.length;
                const job = actionJobs[actionJobIdx];
                
                const msgEl = document.getElementById('action-msg');
                const intentEl = document.getElementById('action-intent');
                if (msgEl) msgEl.innerText = job.msg;
                if (intentEl) intentEl.innerText = job.intent;
                
                const execEl = document.getElementById('action-exec');
                const execIconBox = execEl?.previousElementSibling as HTMLElement | null;
                
                if (execEl) {
                    execEl.innerText = job.exec;
                    execEl.className = `text-[16px] font-extrabold ${job.color} tracking-tight`;
                }
                
                if (execIconBox) {
                    execIconBox.className = `w-8 h-8 ${job.bgColor} rounded-full flex items-center justify-center ${job.color}`;
                }
                
                // Reset timer width instantly
                timerBar.style.transition = 'none';
                timerBar.style.width = '100%';
                
                // Fade in
                container.style.opacity = '1';
                
                // Start timer transition
                setTimeout(() => {
                    timerBar.style.transition = 'width 3.7s linear';
                    timerBar.style.width = '0%';
                }, 50);
                
            }, 300); // Wait for fade out
        }
        
        // Initial setup for the timer bars
        setTimeout(() => {
            const actionTimerBar = document.getElementById('action-timer-bar');
            if (actionTimerBar) actionTimerBar.style.width = '0%';
            
            const featureTimerBar = document.getElementById('feature-timer-bar');
            if (featureTimerBar) featureTimerBar.style.width = '0%';
        }, 50);
        
        const actionInterval = setInterval(cycleActionJob, 4000);

        const convStartTimeout = setTimeout(runConversation, 400);
        
        // Stats Expand Logic
        setTimeout(() => {
            const expandBtn = document.getElementById('expand-stats-btn');
            const expandIcon = document.getElementById('expand-icon');
            const expandedStats = document.getElementById('expanded-stats');
            let isStatsExpanded = false;

            if (expandBtn && expandedStats) {
                expandBtn.addEventListener('click', () => {
                    isStatsExpanded = !isStatsExpanded;
                    const cards = document.querySelectorAll('.stat-card');
                    if (isStatsExpanded) {
                        expandedStats.style.height = expandedStats.scrollHeight + "px";
                        expandedStats.style.marginTop = "2rem";
                        expandIcon.style.transform = "rotate(180deg)";
                        cards.forEach(card => {
                            card.classList.remove('opacity-0', 'translate-y-4');
                            card.classList.add('opacity-100', 'translate-y-0');
                        });
                    } else {
                        expandedStats.style.height = "0px";
                        expandedStats.style.marginTop = "0";
                        expandIcon.style.transform = "rotate(0deg)";
                        cards.forEach(card => {
                            card.classList.add('opacity-0', 'translate-y-4');
                            card.classList.remove('opacity-100', 'translate-y-0');
                        });
                    }
                });
            }
        });

        // Cleanup on unmount (prevents React Strict Mode duplicates)
        return () => {
            clearInterval(actionInterval);
            clearTimeout(convStartTimeout);
            convTimeouts.forEach(id => clearTimeout(id));
            convTimeouts = [];
        };

    }, []);

    return (
        <div className="bg-[#FAFAFA] text-[#111827] overflow-x-hidden">
            {/* Inserted Body */}
            

    {/* Navbar */}
    <nav className="fixed top-4 w-full z-50 px-4">
        <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-2xl">
            <div className="font-bold text-lg tracking-tight flex items-center gap-2 text-gray-900">
                <div className="w-5 h-5 bg-gray-900 rounded-[4px] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                Converra
            </div>
            <div className="hidden md:flex items-center gap-8 font-semibold text-[14px] text-gray-800">
                {/* Dropdown */}
                <div className="relative group cursor-pointer py-4">
                    <div className="flex items-center gap-1 hover:text-black transition">
                        Use Cases
                        <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full -left-4 w-[380px] bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                        <a href="#" className="block p-3 rounded-xl hover:bg-gray-50 transition">
                            <p className="text-[15px] font-bold text-gray-900 mb-0.5">Flows</p>
                            <p className="text-[13px] font-medium text-gray-500">Trigger → condition → action automations</p>
                        </a>
                        <a href="#" className="block p-3 rounded-xl hover:bg-gray-50 transition">
                            <p className="text-[15px] font-bold text-gray-900 mb-0.5">Autopilot</p>
                            <p className="text-[13px] font-medium text-gray-500">AI WhatsApp bot for your customers</p>
                        </a>
                        <a href="#" className="block p-3 rounded-xl hover:bg-gray-50 transition">
                            <p className="text-[15px] font-bold text-gray-900 mb-0.5">Conversational CRM</p>
                            <p className="text-[13px] font-medium text-gray-500">Turn WhatsApp chats into a sales pipeline</p>
                        </a>
                        <a href="#" className="block p-3 rounded-xl hover:bg-gray-50 transition">
                            <p className="text-[15px] font-bold text-gray-900 mb-0.5">Campaigns</p>
                            <p className="text-[13px] font-medium text-gray-500">Broadcast, trigger & drip sequences</p>
                        </a>
                        <a href="#" className="block p-3 rounded-xl hover:bg-gray-50 transition">
                            <p className="text-[15px] font-bold text-gray-900 mb-0.5">Expense Tracking</p>
                            <p className="text-[13px] font-medium text-gray-500">Track team expenses from WhatsApp</p>
                        </a>
                    </div>
                </div>
                
                <a href="#" className="hover:text-black transition">Pricing</a>
                <a href="#" className="hover:text-black transition">Features</a>
                <a href="#" className="hover:text-black transition">Roadmap</a>
            </div>
            <div className="flex items-center gap-5">
                <button onClick={handleLogin} className="text-[13px] font-medium text-gray-500 hover:text-gray-900 hidden sm:block transition">Sign in</button>
                <button onClick={handleLogin} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-semibold text-[13px] transition-all">{email ? "Go to Dashboard" : "Get Started"}</button>
            </div>
        </div>
    </nav>

    {/* HERO */}
    <section className="relative pt-32 pb-20 min-h-[90vh] flex items-center overflow-hidden">
        {/* Full-width Background layers */}
        <div className="absolute inset-0 z-0">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none"></div>
            
            {/* Highly visible floating gradient orbs (Monochrome / No colors) */}
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 blur-[80px]" style={{background: 'radial-gradient(circle, #e5e7eb, transparent 70%)', animation: 'orbit1 15s ease-in-out infinite'}}></div>
            
            <div className="absolute top-20 -right-20 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 blur-[100px]" style={{background: 'radial-gradient(circle, #d1d5db, transparent 70%)', animation: 'orbit2 18s ease-in-out infinite'}}></div>
            
            <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 blur-[90px]" style={{background: 'radial-gradient(circle, #f3f4f6, transparent 70%)', animation: 'orbit3 12s ease-in-out infinite alternate'}}></div>
            
            {/* Fade out at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12">
            {/* LEFT */}
            <div className="w-full lg:w-[45%] text-left pt-10">
                <p className="text-[20px] text-gray-500 font-medium mb-3">AI Sales Agent</p>
                <h1 className="text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] mb-6 text-gray-900 leading-[1.05]">
                    Turn WhatsApp into your best sales rep.
                </h1>
                <p className="text-[18px] text-gray-600 font-medium mb-8 leading-[1.6] max-w-[500px]">
                    Stop answering routine questions manually. Our AI agent reads chats in any language, scores leads, and closes deals — all inside WhatsApp.
                </p>
                
                <ul className="space-y-4 mb-10 text-gray-700 font-medium text-[17px]">
                    <li className="flex items-center gap-3">
                        <svg className="w-[18px] h-[18px] text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        24/7 Always Active AI Chatbot
                    </li>
                    <li className="flex items-center gap-3">
                        <svg className="w-[18px] h-[18px] text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        Multilingual Lead Scoring
                    </li>
                    <li className="flex items-center gap-3">
                        <svg className="w-[18px] h-[18px] text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        Anti-Hallucination Engine
                    </li>
                </ul>

                <button className="bg-[#111827] hover:bg-[#374151] text-white px-8 py-4 rounded-xl font-semibold text-[16px] transition-all duration-200 transform hover:-translate-y-[1px] shadow-lg flex items-center gap-2.5">
                    Book a Call
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
            </div>

        {/* RIGHT: Phone + Cards (no overlap) */}
        <div className="w-full lg:w-[55%] z-10">
            <div className="flex flex-row items-stretch justify-center gap-5">

                {/* PHONE */}
                <div className="shrink-0 w-[270px] h-[540px] flex flex-col bg-white rounded-[2.5rem] border-[6px] border-[#1a1a1a] overflow-hidden relative" style={{boxShadow: '0 25px 60px -15px rgba(0,0,0,0.25), inset 0 0 0 1px #333'}}>
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[55px] h-[12px] bg-black rounded-full z-50"></div>
                    <div className="bg-wa-header h-5"></div>
                    <div className="bg-wa-header px-3 py-2 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-[12px] leading-tight" id="contact-name">Customer</p>
                                <p className="text-[9px] text-wa-green font-medium">online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden bg-wa-bg p-3 flex flex-col gap-2" id="chat-area"></div>
                    <div className="bg-wa-header px-2.5 py-2 flex items-center gap-2 border-t border-gray-200">
                        <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-gray-400">Type a message</div>
                        <div className="w-7 h-7 rounded-full bg-wa-green flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                        </div>
                    </div>
                    <div className="bg-wa-header flex justify-center py-2">
                        <div className="w-[100px] h-[4px] bg-gray-300 rounded-full"></div>
                    </div>
                </div>

                {/* CARDS COLUMN */}
                <div className="flex flex-col gap-3 w-[220px] shrink-0">

                    {/* AI Engine Chip (light theme) */}
                    <div id="crm-chip" className="chat-bubble">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                    </div>
                                    <span className="text-[12px] font-semibold text-gray-900">AI Engine</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                    <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span></span>
                                    <span className="text-[9px] font-semibold text-green-700">Live</span>
                                </div>
                            </div>
                            {/* Data rows */}
                            <div className="px-4 py-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Intent</span>
                                    <span className="text-[12px] font-semibold text-gray-900" id="chip-intent">—</span>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Budget</span>
                                    <span className="text-[12px] font-semibold text-gray-900" id="chip-budget">—</span>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Lead</span>
                                    <span className="text-[12px] font-semibold text-green-600" id="chip-lead">—</span>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Lang</span>
                                    <span className="text-[12px] font-semibold text-blue-600" id="chip-lang">—</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🔔 Notification card (looks like a real push notification) */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3 relative">
                        <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-wa-green flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-bold text-gray-900">Hot Lead Detected</p>
                                    <p className="text-[8px] text-gray-400">just now</p>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5" id="lead-detail">Priya Verma — Budget ₹2,999+</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[8px] font-semibold text-white bg-wa-green px-2 py-0.5 rounded-full">Auto-Qualified</span>
                                    <span className="text-[8px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">CRM Synced</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ⚡ AI Pipeline Visual */}
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3">
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider font-medium mb-2.5">How it works</p>
                        <div className="flex items-center gap-1">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center gap-1 flex-1">
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-wa-green flex items-center justify-center shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-wa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                </div>
                                <p className="text-[8px] text-gray-500 font-medium">Chat</p>
                            </div>
                            {/* Arrow */}
                            <div className="flex-shrink-0 w-5 flex items-center justify-center -mt-3">
                                <div className="h-px w-full bg-gray-300 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-px">
                                        <div className="w-1.5 h-1.5 rounded-full bg-wa-green absolute -top-[2.5px] animate-pipeline"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Step 2 */}
                            <div className="flex flex-col items-center gap-1 flex-1">
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                </div>
                                <p className="text-[8px] text-gray-500 font-medium">AI</p>
                            </div>
                            {/* Arrow */}
                            <div className="flex-shrink-0 w-5 flex items-center justify-center -mt-3">
                                <div className="h-px w-full bg-gray-300 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-px">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-900 absolute -top-[2.5px] animate-pipeline2"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Step 3 */}
                            <div className="flex flex-col items-center gap-1 flex-1">
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                </div>
                                <p className="text-[8px] text-gray-500 font-medium">Score</p>
                            </div>
                            {/* Arrow */}
                            <div className="flex-shrink-0 w-5 flex items-center justify-center -mt-3">
                                <div className="h-px w-full bg-gray-300 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-px">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute -top-[2.5px] animate-pipeline3"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Step 4 */}
                            <div className="flex flex-col items-center gap-1 flex-1">
                                <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <p className="text-[8px] text-gray-500 font-medium">Close</p>
                            </div>
                        </div>
                    </div>

                    {/* 🌐 Language Detection */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-medium">Languages Detected</p>
                            <span className="text-[9px] font-semibold text-gray-900">Today</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-orange-400 shrink-0"></div>
                                <span className="text-[10px] text-gray-700 font-medium w-10">Hindi</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5"><div className="bg-orange-400 h-1.5 rounded-full" style={{width: '65%'}}></div></div>
                                <span className="text-[9px] text-gray-400 w-5 text-right">65%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-400 shrink-0"></div>
                                <span className="text-[10px] text-gray-700 font-medium w-10">Eng</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{width: '25%'}}></div></div>
                                <span className="text-[9px] text-gray-400 w-5 text-right">25%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-purple-400 shrink-0"></div>
                                <span className="text-[10px] text-gray-700 font-medium w-10">Mix</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5"><div className="bg-purple-400 h-1.5 rounded-full" style={{width: '10%'}}></div></div>
                                <span className="text-[9px] text-gray-400 w-5 text-right">10%</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </div>
    </section>

    {/* Marquee Section */}
    <div className="py-4 bg-gray-50 border-y border-gray-200 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
        
        <div className="flex whitespace-nowrap animate-marquee w-max">
            {/* Block 1 */}
            <div className="flex items-center gap-12 px-6">
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Inbox Flooded:</span> <span className="text-gray-600">Your inbox is flooded with repetitive customer queries.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Manual Forms:</span> <span className="text-gray-600">You're still using boring Google Forms to capture leads.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Wasted Time:</span> <span className="text-gray-600">Your agents spend majority of their time on irrelevant questions.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Lost Leads:</span> <span className="text-gray-600">You're losing leads because you are completely unavailable after hours.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            </div>
            {/* Block 2 */}
            <div className="flex items-center gap-12 px-6">
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Inbox Flooded:</span> <span className="text-gray-600">Your inbox is flooded with repetitive customer queries.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Manual Forms:</span> <span className="text-gray-600">You're still using boring Google Forms to capture leads.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Wasted Time:</span> <span className="text-gray-600">Your agents spend majority of their time on irrelevant questions.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="flex items-center gap-2"><span className="font-bold text-gray-900">Lost Leads:</span> <span className="text-gray-600">You're losing leads because you are completely unavailable after hours.</span></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            </div>
        </div>
    </div>

    {/* SECTION 2: Bento Features */}
    <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                    {/* Title Box */}
                    <div className="pt-4 pb-8 pl-2">
                        <h2 className="text-[42px] md:text-[56px] font-medium tracking-tight text-gray-900 leading-[1.1]">
                            Automate your pipeline, <br className="hidden md:block" />
                            qualify leads & <span className="bg-[#F3F4F6] px-5 py-1 rounded-2xl inline-block mt-2">close faster!</span>
                        </h2>
                    </div>

                    {/* Rotating Feature Card */}
                    <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 flex flex-col relative overflow-hidden flex-1 border border-gray-200 min-h-[500px]">
                        {/* Top Timer */}
                        <div className="flex items-center justify-start z-20 relative mb-8">
                            <div className="w-[120px] h-[5px] bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                <div id="feature-timer-bar" className="h-full bg-blue-600 rounded-full w-full" style={{transition: 'width 3.7s linear'}}></div>
                            </div>
                            {/* Progress indicator */}
                            <span id="feature-counter" className="ml-4 text-[13px] font-bold text-gray-400 tracking-widest">1 / 4</span>
                        </div>

                        <div id="feature-text-container" className="relative z-10 w-full flex flex-col transition-opacity duration-300">
                            {/* Text Content */}
                            <div className="mb-8">
                                <h3 id="feature-title" className="text-[32px] md:text-[38px] font-extrabold text-gray-900 mb-3 leading-tight tracking-tight">Scale Without Expanding</h3>
                                <p id="feature-desc" className="text-[16px] font-medium text-gray-600 leading-relaxed max-w-[90%] mb-6">Handle massive query volumes with zero extra staff. Converra acts as your tireless digital workforce.</p>
                                
                                {/* 3 Checks List */}
                                <ul id="feature-checks" className="flex flex-col gap-3.5">
                                    {/* Dynamic li injection */}
                                </ul>
                            </div>
                        </div>

                        {/* Dynamic Visuals Container */}
                        <div className="mt-auto relative w-full h-[220px] bg-white rounded-3xl border border-gray-100 shadow-inner overflow-hidden z-10">
                            {/* Visual 0: Scale (Abstract Glowing Nodes) */}
                            <div id="vis-0" className="absolute inset-0 flex items-center justify-center bg-zinc-950 transition-opacity duration-300">
                                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="w-[80%] h-1 bg-zinc-800 rounded-full relative">
                                        <div className="absolute left-0 top-0 h-full w-[40%] bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_#3b82f6]"></div>
                                        
                                        {/* Nodes */}
                                        <div className="absolute -top-3 left-[10%] w-7 h-7 bg-zinc-900 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_10px_#3b82f6]">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="absolute -top-3 left-[50%] w-7 h-7 bg-zinc-900 border-2 border-purple-500 rounded-full flex items-center justify-center shadow-[0_0_10px_#a855f7]">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                                        </div>
                                        <div className="absolute -top-3 left-[90%] w-7 h-7 bg-zinc-900 border-2 border-green-500 rounded-full flex items-center justify-center shadow-[0_0_10px_#22c55e]">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold px-4 py-1.5 rounded-full">
                                    10,000+ Concurrent Chats
                                </div>
                            </div>

                            {/* Visual 1: Lead Qual (Conversational AI Flow) */}
                            <div id="vis-1" className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 transition-opacity duration-300 opacity-0 pointer-events-none p-6">
                                <div className="w-full max-w-sm flex flex-col gap-3 relative">
                                    <div className="absolute -left-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-4 py-3 rounded-2xl rounded-bl-none text-sm self-start shadow-lg transform -rotate-1 origin-bottom-left">
                                        "We need a plan for 50 users."
                                    </div>
                                    <div className="flex items-center gap-3 self-end mt-2">
                                        <div className="bg-indigo-900/50 backdrop-blur-md border border-indigo-400/30 text-indigo-100 px-4 py-3 rounded-2xl rounded-br-none text-sm shadow-lg transform rotate-1 origin-bottom-right">
                                            Generating custom quote...
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_#22c55e]">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                    </div>
                                    <div className="absolute right-4 -bottom-2 bg-white text-indigo-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Hot Lead
                                    </div>
                                </div>
                            </div>

                            {/* Visual 2: CRM Sync (Data Pipeline) */}
                            <div id="vis-2" className="absolute inset-0 bg-[#F9FAFB] transition-opacity duration-300 opacity-0 pointer-events-none overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                
                                <div className="relative z-10 flex items-center gap-2">
                                    {/* Converra */}
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center z-10 transform hover:scale-105 transition-transform">
                                        <div className="w-8 h-8 bg-black rounded-lg"></div>
                                    </div>
                                    
                                    {/* Animated Line */}
                                    <div className="w-24 h-8 relative flex items-center justify-center">
                                        <div className="w-full h-0.5 bg-gray-300 rounded-full border-t border-b border-dashed border-gray-400"></div>
                                        <div className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-[ping_1.5s_infinite] left-0"></div>
                                        <div className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full left-0 animate-[shimmer_1.5s_infinite]"></div>
                                    </div>
                                    
                                    {/* CRM */}
                                    <div className="w-14 h-14 bg-[#FF7A59] rounded-xl shadow-[0_4px_20px_rgba(255,122,89,0.3)] border border-[#ff6640] flex items-center justify-center z-10 transform hover:scale-105 transition-transform">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Real-Time Sync</div>
                            </div>

                            {/* Visual 3: Multilingual (Floating Translating Bubbles) */}
                            <div id="vis-3" className="absolute inset-0 flex items-center justify-center bg-gray-900 transition-opacity duration-300 opacity-0 pointer-events-none">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
                                    
                                    <div className="flex flex-col gap-4 w-full px-12">
                                        {/* Spanish -> English */}
                                        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl w-full">
                                            <span className="text-white/60 text-xs line-through decoration-red-500">¿Cuánto cuesta?</span>
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                            <span className="text-green-400 text-sm font-bold">How much is it?</span>
                                        </div>
                                        
                                        {/* English -> Hindi */}
                                        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl w-full">
                                            <span className="text-white/60 text-xs line-through decoration-red-500">It's $50/month</span>
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                            <span className="text-blue-400 text-sm font-bold">यह $50/महीना है</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Tall Blue Card */}
                    <div className="bg-[#0B66C2] rounded-[2rem] p-8 flex flex-col relative overflow-hidden flex-1 min-h-[500px]">
                        {/* Top Timer replacing the badge */}
                        <div className="flex items-center justify-end z-20 relative">
                            <div className="w-[120px] h-[5px] bg-white/20 rounded-full overflow-hidden shadow-inner">
                                <div id="action-timer-bar" className="h-full bg-white rounded-full w-full" style={{transition: 'width 3.7s linear'}}></div>
                            </div>
                        </div>

                        {/* Explanatory Text */}
                        <div className="mt-10 mb-auto relative z-20">
                            <h3 className="text-white text-[28px] font-extrabold leading-tight mb-4 tracking-tight">Action-Driven<br/>Workflows</h3>
                            <p className="text-[16px] font-medium text-white/80 leading-relaxed pr-2">
                                Move beyond basic FAQs. Our AI perfectly detects complex customer intents and instantly executes real business tasks across your systems.
                            </p>
                        </div>

                        {/* Chat/Action Graphic inside */}
                        <div id="action-animation-container" className="relative z-10 w-full flex flex-col gap-8 transition-opacity duration-300 mt-12 mb-4">
                            {/* Input msg bubble (Modern Glassmorphism) */}
                            <div id="action-msg" className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-5 rounded-2xl rounded-bl-none text-[15px] font-medium max-w-[90%] shadow-lg">
                                "I need to cancel my order #9982"
                            </div>

                            {/* Animated Pipeline line with node */}
                            <div className="w-full flex items-center gap-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-white/40 to-transparent relative">
                                    <div className="absolute -left-1 -top-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                </div>
                                <div className="flex-1 h-px bg-gradient-to-l from-white/40 to-transparent relative">
                                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                </div>
                            </div>

                            {/* Intent/Action Box (Premium Card) */}
                            <div className="flex justify-center">
                                <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center min-w-[200px] border border-gray-100 transform rotate-[-2deg]">
                                    <p id="action-intent" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">CANCEL ORDER</p>
                                    <div className="w-full h-px bg-gray-50 mb-3"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                        <span id="action-exec" className="text-[16px] font-extrabold text-green-600 tracking-tight">API Executed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating blobs */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-[0.05] rounded-full blur-[50px] z-0 pointer-events-none"></div>
                    </div>

                    {/* Small Right Bottom Card */}
                    <div className="bg-[#F3F4F6] rounded-[2rem] p-8 flex flex-col justify-center min-h-[160px] relative transition-all duration-500 ease-in-out">
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <p className="text-[38px] md:text-[44px] font-extrabold text-gray-900 leading-none mb-2 tracking-tight">14,208+</p>
                                <p className="text-[16px] text-gray-500 font-bold tracking-wide">Queries Handled</p>
                            </div>
                            {/* Circle Buttons */}
                            <div className="flex gap-3 shrink-0">
                                <button className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform group" id="expand-stats-btn">
                                    <svg className="w-6 h-6 text-white transition-transform duration-300" id="expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Expanded Stats Area */}
                        <div className="grid grid-cols-2 gap-4 mt-0 h-0 overflow-hidden transition-all duration-500 ease-in-out" id="expanded-stats">
                            <div className="stat-card bg-white p-5 rounded-[1.25rem] shadow-sm opacity-0 translate-y-4 transition-all duration-500 delay-[100ms]">
                                <p className="text-[26px] md:text-[30px] font-extrabold text-gray-900 leading-none mb-1.5">&lt; 2s</p>
                                <p className="text-[14px] text-gray-500 font-medium">Avg. Response Time</p>
                            </div>
                            <div className="stat-card bg-white p-5 rounded-[1.25rem] shadow-sm opacity-0 translate-y-4 transition-all duration-500 delay-[200ms]">
                                <p className="text-[26px] md:text-[30px] font-extrabold text-gray-900 leading-none mb-1.5">94%</p>
                                <p className="text-[14px] text-gray-500 font-medium">Resolution Rate</p>
                            </div>
                            <div className="stat-card bg-white p-5 rounded-[1.25rem] shadow-sm opacity-0 translate-y-4 transition-all duration-500 delay-[300ms]">
                                <p className="text-[26px] md:text-[30px] font-extrabold text-gray-900 leading-none mb-1.5">24/7</p>
                                <p className="text-[14px] text-gray-500 font-medium">Availability</p>
                            </div>
                            <div className="stat-card bg-white p-5 rounded-[1.25rem] shadow-sm opacity-0 translate-y-4 transition-all duration-500 delay-[400ms]">
                                <p className="text-[26px] md:text-[30px] font-extrabold text-gray-900 leading-none mb-1.5">$0</p>
                                <p className="text-[14px] text-gray-500 font-medium">Human Cost</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    </section>

    {/* SECTION 3: Platforms Integration */}
    <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-3 tracking-tight leading-tight">Platforms Where You<br/>Can Use Converra</h2>
            <p className="text-[#6B7280] font-medium text-[14px] max-w-lg mx-auto mb-16">Seamlessly integrate and automate across multiple platforms</p>

            <div className="relative w-full max-w-[900px] mx-auto h-[500px] flex items-center justify-center">
                {/* Circular Outline Animation */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] z-0 pointer-events-none" viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="450" cy="300" rx="380" ry="240" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="10 10" className="animate-dash" />
                </svg>
                {/* Center Graphic */}
                <img src="/sitting_person.png" alt="Person working" className="w-[320px] mix-blend-multiply opacity-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* Left Top Card */}
                <div className="absolute left-[-2%] top-[15%] w-[250px] bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-left z-20">
                    <div className="w-5 h-5 mb-3 text-[#374151]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                    </div>
                    <h4 className="font-bold text-[#111827] text-[13px] mb-2">Website</h4>
                    <p className="text-[#6B7280] text-[12px] leading-relaxed">Have your AI Agent provide live support over your website 24/7.</p>
                </div>

                {/* Left Bottom Card */}
                <div className="absolute left-[3%] bottom-[10%] w-[250px] bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-left z-20">
                    <div className="w-5 h-5 mb-3 text-[#374151]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    </div>
                    <h4 className="font-bold text-[#111827] text-[13px] mb-2">WhatsApp</h4>
                    <p className="text-[#6B7280] text-[12px] leading-relaxed">Turn your mobile WhatsApp into a full-fledged AI chatbot that talks like you</p>
                </div>

                {/* Right Top Card */}
                <div className="absolute right-[-2%] top-[25%] w-[250px] bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-left z-20">
                    <h4 className="font-bold text-[#111827] text-[13px] mb-2">WhatsApp API</h4>
                    <p className="text-[#6B7280] text-[12px] leading-relaxed">Connect WhatsApp API, send campaigns, and let Converra handle interested customer queries.</p>
                </div>

                {/* Right Bottom Card */}
                <div className="absolute right-[3%] bottom-[5%] w-[250px] bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-left z-20">
                    <div className="w-5 h-5 mb-3 text-[#374151]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    </div>
                    <h4 className="font-bold text-[#111827] text-[13px] mb-2">Applications</h4>
                    <p className="text-[#6B7280] text-[12px] leading-relaxed">Train Converra and offer in-app support so customers get help without leaving.</p>
                </div>
            </div>
        </div>
    </section>
    {/* SECTION: Built for your Industry */}
    <section className="py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-4 tracking-tight leading-tight">Built for your industry</h2>
            <p className="text-[#6B7280] text-[16px] mb-12 max-w-2xl mx-auto">See how Converra automates customer interactions specifically for your business type.</p>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16" id="industry-tabs">
                <button className="industry-tab active bg-[#111827] text-white px-6 py-2.5 rounded-full font-semibold text-[15px] transition-all border border-transparent" data-target="real-estate">Real Estate</button>
                <button className="industry-tab bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full font-semibold text-[15px] transition-all border border-transparent" data-target="healthcare">Healthcare</button>
                <button className="industry-tab bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full font-semibold text-[15px] transition-all border border-transparent" data-target="education">Education</button>
                <button className="industry-tab bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full font-semibold text-[15px] transition-all border border-transparent" data-target="travel">Travel</button>
                <button className="industry-tab bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full font-semibold text-[15px] transition-all border border-transparent" data-target="logistics">Logistics</button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-left flex flex-col md:flex-row gap-12 items-center" id="industry-content">
                
                {/* Left: Benefits */}
                <div className="flex-1 w-full transition-opacity duration-300" id="industry-text-container">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6" id="industry-title">Automate Property Inquiries & Lead Qualification</h3>
                    <ul className="space-y-4" id="industry-bullets">
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg></div>
                            <span className="text-gray-600 text-[15px] leading-relaxed">Instantly answer questions about pricing, floor plans, and availability.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg></div>
                            <span className="text-gray-600 text-[15px] leading-relaxed">Automatically schedule site visits and collect contact details.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg></div>
                            <span className="text-gray-600 text-[15px] leading-relaxed">Pre-qualify leads based on budget, location preference, and urgency.</span>
                        </li>
                    </ul>
                </div>

                {/* Right: Chat Mockup */}
                <div className="flex-1 w-full flex justify-center">
                    <div className="w-full max-w-[350px] bg-[#EFEAE2] border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative transition-opacity duration-300 flex flex-col" id="industry-chat-container">
                        
                        {/* WhatsApp Header */}
                        <div className="bg-[#008069] px-4 py-3 flex items-center justify-between shadow-sm relative z-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-lg">C</span>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-[15px] text-white leading-tight">Converra Agent</h5>
                                    <p className="text-[12px] text-white/80 leading-tight mt-0.5">online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="p-4 flex flex-col gap-3 h-[280px] overflow-y-auto relative z-0" id="industry-chat">
                            {/* User Msg */}
                            <div className="self-end max-w-[85%] bg-[#D9FDD3] text-gray-900 rounded-lg rounded-tr-none px-3 pt-2 pb-1.5 text-[14px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] relative">
                                Hi, do you have 3BHK apartments near downtown under $500k?
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className="text-[10px] text-gray-500 leading-none">10:42 AM</span>
                                    <svg className="w-3.5 h-3.5 text-[#53bdeb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <svg className="absolute top-0 right-[-8px] text-[#D9FDD3]" width="8" height="13" viewBox="0 0 8 13"><path d="M5.188 1H0v11.142l4.606-4.502A5.132 5.132 0 008 4.04V1H5.188z" fill="currentColor"/></svg>
                            </div>
                            {/* Bot Msg */}
                            <div className="self-start max-w-[85%] bg-white text-gray-900 rounded-lg rounded-tl-none px-3 pt-2 pb-1.5 text-[14px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] relative leading-relaxed">
                                Hello! Yes, we have two premium 3BHK properties available downtown. 'Skyline Heights' starts at $450k. Would you like me to share the brochure or schedule a site visit?
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className="text-[10px] text-gray-500 leading-none">10:42 AM</span>
                                </div>
                                <svg className="absolute top-0 left-[-8px] text-white" width="8" height="13" viewBox="0 0 8 13"><path d="M2.812 1H8v11.142L3.394 7.64A5.132 5.132 0 010 4.04V1h2.812z" fill="currentColor"/></svg>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="bg-[#F0F2F5] px-3 py-2.5 flex items-center gap-2 border-t border-gray-200 shrink-0">
                            <svg className="w-6 h-6 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <svg className="w-6 h-6 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                            
                            <div className="flex-1 bg-white rounded-full px-4 py-2 text-[14px] text-gray-400">
                                Type a message
                            </div>
                            
                            <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>

    {/* SECTION 4: How It Works (Light Theme) */}
    <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-center">
                
                {/* Left Side (Text & Steps) */}
                <div className="flex-1 w-full max-w-[500px]">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-4 tracking-tight leading-tight">From zero to live AI<br/>in 5 minutes</h2>
                    <p className="text-[#6B7280] text-[15px] mb-12 leading-relaxed">No technical skills. No Meta approvals. No complex setup. Just three steps and your AI is answering customers.</p>

                    {/* Steps List */}
                    <div className="flex flex-col gap-2 mb-12">
                        {/* Step 1 (Inactive) */}
                        <div className="flex items-start gap-5 p-5 text-[#4B5563] rounded-2xl transition-colors opacity-70 hover:opacity-100 cursor-pointer">
                            <div className="w-8 h-8 mt-0.5 flex items-center justify-center font-bold text-[14px] border border-gray-300 rounded-lg shrink-0 text-gray-600">1</div>
                            <div>
                                <h4 className="font-bold text-[18px] text-[#111827] tracking-tight mb-1.5">Sign Up — 2 Minutes</h4>
                                <p className="text-[15px] text-gray-500 leading-relaxed">Visit UseConverra, enter your business name, email, and password. Free account instantly — no credit card.</p>
                            </div>
                        </div>

                        {/* Step 2 (Active) */}
                        <div className="flex items-start gap-5 p-6 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl relative overflow-hidden transform hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-blue-500"></div>
                            <div className="w-8 h-8 mt-0.5 flex items-center justify-center font-bold text-[14px] bg-blue-50 text-blue-600 border border-blue-100 rounded-lg shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-[18px] text-[#111827] tracking-tight mb-1.5">Train AI — 3 Minutes</h4>
                                <p className="text-[15px] text-gray-500 leading-relaxed">Type your website link and click Crawl. The system reads every page — products, prices, policies, FAQs. AI becomes an expert on your business instantly.</p>
                            </div>
                        </div>

                        {/* Step 3 (Inactive) */}
                        <div className="flex items-start gap-5 p-5 text-[#4B5563] rounded-2xl transition-colors opacity-70 hover:opacity-100 cursor-pointer">
                            <div className="w-8 h-8 mt-0.5 flex items-center justify-center font-bold text-[14px] border border-gray-300 rounded-lg shrink-0 text-gray-600">3</div>
                            <div>
                                <h4 className="font-bold text-[18px] text-[#111827] tracking-tight mb-1.5">Go Live — 60 Seconds</h4>
                                <p className="text-[15px] text-gray-500 leading-relaxed">Embed or link — automation is ON. Copy the script tag and paste it into your website or link WhatsApp.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pills for What happens technically */}
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">What Happens Technically</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-[#F9FAFB] text-[#4B5563] text-[13px] font-medium rounded-lg border border-gray-100">Crawl & Chunk</span>
                        <span className="px-3 py-1.5 bg-[#F9FAFB] text-[#4B5563] text-[13px] font-medium rounded-lg border border-gray-100">Embed & Index</span>
                        <span className="px-3 py-1.5 bg-[#F9FAFB] text-[#4B5563] text-[13px] font-medium rounded-lg border border-gray-100">Semantic Search</span>
                        <span className="px-3 py-1.5 bg-[#F9FAFB] text-[#4B5563] text-[13px] font-medium rounded-lg border border-gray-100">Gemini Replies</span>
                    </div>
                </div>

                {/* Right Side Graphic (Full Flow Node Map) */}
                <div className="flex-1 w-full flex items-center justify-center relative min-h-[400px] scale-90 lg:scale-100">
                    <div className="relative w-full max-w-[600px] h-[400px]">
                        
                        {/* Central Node */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center justify-center z-20 hover:scale-105 transition-transform duration-500">
                            <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">C</span>
                            <div className="absolute bottom-3 w-6 h-[3px] bg-blue-600 rounded-full"></div>
                        </div>

                        {/* INPUT NODES (Left) */}
                        {/* Website */}
                        <div className="absolute top-[10%] left-[0%] w-14 h-14 bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-gray-100 flex items-center justify-center z-20 animate-[bounce_4s_infinite]">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                        </div>
                        {/* Docs */}
                        <div className="absolute top-[45%] left-[5%] w-14 h-14 bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-gray-100 flex items-center justify-center z-20 animate-[bounce_5s_infinite]">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        {/* Manual Q&A */}
                        <div className="absolute bottom-[10%] left-[0%] w-14 h-14 bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-gray-100 flex items-center justify-center z-20 animate-[bounce_6s_infinite]">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                        </div>

                        {/* OUTPUT NODES (Right) */}
                        {/* Widget */}
                        <div className="absolute top-[10%] right-[0%] w-14 h-14 bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-gray-100 flex items-center justify-center z-20 animate-[bounce_5s_infinite]">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                        </div>
                        {/* WhatsApp */}
                        <div className="absolute top-[45%] right-[5%] w-14 h-14 bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-gray-100 flex items-center justify-center z-20 animate-[bounce_6s_infinite]">
                            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </div>
                        {/* Instagram */}
                        <div className="absolute bottom-[10%] right-[0%] w-14 h-14 bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-gray-100 flex items-center justify-center z-20 animate-[bounce_4s_infinite]">
                            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8zm8 6a2 2 0 100-4 2 2 0 000 4zm4-5.5a.5.5 0 11-1 0 .5.5 0 011 0z"/></svg>
                        </div>

                        {/* Connectors SVG */}
                        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 600 400" preserveAspectRatio="none">
                            {/* Input to Center */}
                            <path d="M 40 60 C 150 60, 200 200, 270 200" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                            <path d="M 70 200 C 150 200, 200 200, 270 200" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                            <path d="M 40 340 C 150 340, 200 200, 270 200" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                            
                            {/* Center to Output */}
                            <path d="M 330 200 C 400 200, 450 60, 560 60" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                            <path d="M 330 200 C 400 200, 450 200, 530 200" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                            <path d="M 330 200 C 400 200, 450 340, 560 340" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                        </svg>

                        {/* HTML Labels over connectors */}
                        {/* Input Labels */}
                        <div className="absolute top-[20%] left-[22%] -translate-x-1/2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] text-gray-500 shadow-sm z-20 font-medium whitespace-nowrap">Website</div>
                        <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] text-gray-500 shadow-sm z-20 font-medium whitespace-nowrap">PDF Docs</div>
                        <div className="absolute top-[80%] left-[22%] -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] text-gray-500 shadow-sm z-20 font-medium whitespace-nowrap">Manual Q&A</div>

                        {/* Output Labels */}
                        <div className="absolute top-[20%] right-[22%] translate-x-1/2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] text-gray-500 shadow-sm z-20 font-medium whitespace-nowrap">Chat Widget</div>
                        <div className="absolute top-[50%] right-[20%] translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] text-gray-500 shadow-sm z-20 font-medium whitespace-nowrap">WhatsApp</div>
                        <div className="absolute top-[80%] right-[22%] translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] text-gray-500 shadow-sm z-20 font-medium whitespace-nowrap">Instagram</div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    {/* Dedicated CTA Section (Bottom) */}
    <section className="pb-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
            <div className="bg-[#111827] rounded-[2.5rem] p-12 border border-gray-900 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-white opacity-[0.03] rounded-full blur-[60px] pointer-events-none"></div>
                <div className="relative z-10 max-w-xl">
                    <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Ready to scale your sales?</h3>
                    <p className="text-[17px] text-gray-400">Join modern sales teams automating their pipeline with Converra. Set up in minutes, no coding required.</p>
                </div>
                <div className="relative z-10 shrink-0">
                    <button onClick={handleLogin} className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-[16px] hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        Get Started Free
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </section>

        </div>
    )
}
