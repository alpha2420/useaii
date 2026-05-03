# Project Overview: AI-Powered Support & CRM System

This project is a state-of-the-art AI solution designed to automate customer support and sales processes while acting as an intelligent CRM. It integrates directly with **WhatsApp** and provides a **Web Chatbot** widget, all managed through a centralized **Next.js Dashboard**.

---

## 🚀 The Core Process (Starting to End)

### 1. Message Reception
Whether a customer reaches out via the **WhatsApp bot** or the **Website Chatbot**, the system immediately captures the message.
- **WhatsApp**: A background worker (using `whatsapp-web.js`) monitors incoming messages in real-time.
- **Web Chat**: A script embedded on the business website sends messages to the backend API.

### 2. Intelligent Context Preparation
Before responding, the system gathers everything it needs to sound human and professional:
- **Memory**: It retrieves the last few messages from the database to maintain conversation context.
- **Knowledge Base (RAG)**: it pulls the specific business information (FAQs, pricing, services) provided by the owner.
- **Business Identity**: It injects the business name, support email, and specific "Agent Instructions" (e.g., "Be polite and use emojis").

### 3. Multi-Model AI Response
The system uses a sophisticated "Fallback Chain" to ensure the bot is always online:
- **Primary**: **Gemini 2.0 Flash** (Fast and accurate).
- **Fallbacks**: If Gemini fails, it automatically tries **OpenAI (GPT-4o-mini)**, **Grok (xAI)**, or **Groq (Llama 3)**.
- **Smart Filtering**: The AI is instructed to ONLY answer based on the provided business info. If it doesn't know the answer, it tells the customer: *"I'll connect you with our team shortly!"*

### 4. CRM Enrichment & Lead Generation
This is where the "CRM" part happens. Every conversation is automatically analyzed by AI to extract business value:
- **Intent Detection**: Is the customer *buying*, *inquiring*, or *complaining*?
- **Lead Scoring**: It labels contacts as **Hot**, **Warm**, or **Cold** based on their interest level.
- **Data Extraction**: It automatically pulls the customer's **Name**, **Budget**, **Company**, and **Location** from the chat.
- **Next Best Action**: It suggests what the owner should do next (e.g., *"Send a pricing catalog"* or *"Follow up tomorrow"*).

### 5. Management & Human Takeover
The business owner uses the **Next.js Dashboard** to:
- **Monitor**: Watch AI conversations in real-time.
- **Intervene**: If a "Hot Lead" is detected, the owner can **Pause AI** with one click and take over the chat manually.
- **Train**: Any question the AI couldn't answer is moved to an "Unanswered Questions" list, allowing the owner to update the knowledge base.

---

## 🛠 Technical Architecture

- **Frontend**: Next.js (Tailwind CSS, Lucide Icons, Framer Motion) for a premium dashboard experience.
- **Backend Logic**: Node.js workers and API routes handling AI orchestration.
- **Database**: MongoDB (Mongoose) for storing conversations, leads, and settings.
- **AI Stack**: Google Gemini, OpenAI, Groq, and xAI APIs.
- **Communication**: `whatsapp-web.js` with remote session storage for 24/7 WhatsApp uptime.

---

## 📂 Key File Structure

- `backend/worker.ts`: The "brain" that manages WhatsApp and AI logic.
- `backend/services/analyzeConversation.ts`: The CRM logic that extracts lead data.
- `frontend/app/`: The dashboard UI where owners manage their business.
- `public/chatBot.js`: The embeddable website widget.
- `shared/lib/db.ts`: Database connection management.

---

## ⚙️ Deployment & Uptime (PM2)

The system is designed for high availability and production-grade stability:
- **PM2 Orchestration**: The system runs two separate processes simultaneously via `ecosystem.config.js`:
    1. **`frontend`**: Serves the Next.js dashboard and API routes.
    2. **`worker`**: Runs the WhatsApp logic and AI background processing.
- **Auto-Restart**: If either process crashes (e.g., due to a network glitch), PM2 automatically restarts it within seconds.
- **Remote Auth**: WhatsApp sessions are stored in MongoDB, meaning the bot stays logged in even after server restarts.

---

## 💎 Premium Features Included

- **Proactive Fallbacks**: Never gives a "I don't know" error; always tries to bridge to a human.
- **Response Caching**: If two customers ask the same thing, the system responds instantly without using AI tokens.
- **Media Support**: Automatically shares product photos or PDF links when relevant.
- **Auto-Correction**: Cleans customer slang and typos before processing to ensure high-quality AI understanding.
