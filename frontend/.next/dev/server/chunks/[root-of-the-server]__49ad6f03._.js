module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/support-ai copy/shared/lib/env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const envSchema = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    MONGODB_URL: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
    GEMINI_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    OPENAI_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    GROK_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    GROQ_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default('http://localhost:3000'),
    UPSTASH_REDIS_REST_URL: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'development',
        'production',
        'test'
    ]).default('development')
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}
const env = _env.data;
}),
"[project]/Desktop/support-ai copy/shared/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/env.ts [app-route] (ecmascript)");
;
;
let cache = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cache) {
    cache = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDb() {
    if (cache.conn) {
        return cache.conn;
    }
    if (!cache.promise) {
        const options = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        };
        cache.promise = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["connect"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].MONGODB_URL, options).then((mongoose)=>{
            console.log("✅ MongoDB Connected Successfully");
            return mongoose.connection;
        });
    }
    try {
        cache.conn = await cache.promise;
    } catch (error) {
        cache.promise = null;
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
    }
    return cache.conn;
}
const __TURBOPACK__default__export__ = connectDb;
}),
"[project]/Desktop/support-ai copy/backend/models/conversation.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const MessageSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    role: {
        type: String,
        enum: [
            "customer",
            "bot",
            "owner"
        ],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
});
const EnrichedSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    company: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    language: {
        type: String,
        default: null
    }
}, {
    _id: false
});
const ConversationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        default: ""
    },
    messages: {
        type: [
            MessageSchema
        ],
        default: []
    },
    // AI Analysis
    intent: {
        type: String,
        enum: [
            "buying",
            "inquiry",
            "complaint",
            "spam",
            "unknown"
        ],
        default: "unknown"
    },
    urgency: {
        type: String,
        enum: [
            "high",
            "medium",
            "low"
        ],
        default: "low"
    },
    leadScore: {
        type: String,
        enum: [
            "hot",
            "warm",
            "cold"
        ],
        default: "cold"
    },
    extractedName: {
        type: String,
        default: null
    },
    extractedBudget: {
        type: String,
        default: null
    },
    summary: {
        type: String,
        default: null
    },
    lastAnalyzedAt: {
        type: Date,
        default: null
    },
    sentiment: {
        type: String,
        enum: [
            "positive",
            "neutral",
            "negative",
            "unknown"
        ],
        default: "unknown"
    },
    source: {
        type: String,
        enum: [
            "whatsapp",
            "widget",
            "email",
            "unknown"
        ],
        default: "whatsapp" // Defaulting to WhatsApp since that's the main channel
    },
    firstReplyTime: {
        type: Number,
        default: null
    },
    // Next Best Action
    nextBestAction: {
        type: String,
        default: null
    },
    nextBestActionType: {
        type: String,
        enum: [
            "follow_up",
            "send_pricing",
            "close",
            "nurture",
            "escalate",
            "none",
            null
        ],
        default: null
    },
    // Enriched Records
    enriched: {
        type: EnrichedSchema,
        default: ()=>({})
    },
    // CRM
    stage: {
        type: String,
        enum: [
            "new",
            "contacted",
            "interested",
            "negotiating",
            "won",
            "lost"
        ],
        default: "new"
    },
    notes: {
        type: String,
        default: ""
    },
    tags: {
        type: [
            String
        ],
        default: []
    },
    isAiPaused: {
        type: Boolean,
        default: false
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
ConversationSchema.index({
    ownerId: 1,
    contactNumber: 1
}, {
    unique: true
});
const Conversation = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.Conversation || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("Conversation", ConversationSchema);
const __TURBOPACK__default__export__ = Conversation;
}),
"[project]/Desktop/support-ai copy/backend/models/pending-message.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const PendingMessageSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    to: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "pending",
            "sent",
            "failed"
        ],
        default: "pending"
    }
}, {
    timestamps: true
});
// Auto-delete sent/failed messages after 7 days
PendingMessageSchema.index({
    updatedAt: 1
}, {
    expireAfterSeconds: 604800
});
const PendingMessage = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.PendingMessage || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("PendingMessage", PendingMessageSchema);
const __TURBOPACK__default__export__ = PendingMessage;
}),
"[project]/Desktop/support-ai copy/shared/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signToken",
    ()=>signToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
;
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback_dev_secret_change_me_in_production");
async function signToken(payload) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime("24h").sign(secret);
}
async function verifyToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secret);
        return payload;
    } catch  {
        return null;
    }
}
}),
"[project]/Desktop/support-ai copy/shared/lib/getSession.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSession",
    ()=>getSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/auth.ts [app-route] (ecmascript)");
;
;
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
        return null;
    }
    const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
    if (!payload) {
        return null;
    }
    return {
        user: {
            id: payload.userId,
            email: payload.email,
            name: payload.name
        }
    };
}
}),
"[project]/Desktop/support-ai copy/frontend/app/api/crm/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/conversation.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$pending$2d$message$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/pending-message.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$getSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/getSession.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(req) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$getSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session || !session.user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Unauthorized"
        }, {
            status: 401
        });
        const ownerId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(req.url);
        const stage = searchParams.get("stage");
        const leadScore = searchParams.get("leadScore");
        const contactNumber = searchParams.get("contactNumber"); // fetch single convo with messages
        // ── Single conversation with full messages ─────────────────────────
        if (contactNumber) {
            const convo = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                ownerId,
                contactNumber
            }).lean();
            if (!convo) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Not found"
            }, {
                status: 404
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(convo);
        }
        // ── Contacts list ──────────────────────────────────────────────────
        const filter = {
            ownerId
        };
        if (stage) filter.stage = stage;
        if (leadScore) filter.leadScore = leadScore;
        const contacts = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(filter).sort({
            lastMessageAt: -1
        }).limit(100).select("-messages") // exclude messages for list view
        .lean();
        // Stats
        const [total, hot, warm, cold, won, newLeads] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
                ownerId
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
                ownerId,
                leadScore: "hot"
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
                ownerId,
                leadScore: "warm"
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
                ownerId,
                leadScore: "cold"
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
                ownerId,
                stage: "won"
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
                ownerId,
                stage: "new"
            })
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            contacts,
            stats: {
                total,
                hot,
                warm,
                cold,
                won,
                newLeads
            }
        });
    } catch (error) {
        console.error("[CRM GET]", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
async function PATCH(req) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$getSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session || !session.user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Unauthorized"
        }, {
            status: 401
        });
        const ownerId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await req.json();
        const { contactNumber, stage, notes, tags, isAiPaused } = body;
        if (!contactNumber) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "contactNumber is required"
            }, {
                status: 400
            });
        }
        const updates = {};
        if (stage !== undefined) updates.stage = stage;
        if (notes !== undefined) updates.notes = notes;
        if (tags !== undefined) updates.tags = tags;
        if (isAiPaused !== undefined) updates.isAiPaused = isAiPaused;
        const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$conversation$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            ownerId,
            contactNumber
        }, {
            $set: updates
        }, {
            new: true
        }).select("-messages").lean();
        if (!updated) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Contact not found"
        }, {
            status: 404
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
    } catch (error) {
        console.error("[CRM PATCH]", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$getSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session || !session.user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Unauthorized"
        }, {
            status: 401
        });
        const ownerId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { contactNumber, text } = await req.json();
        if (!contactNumber || !text) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "contactNumber and text are required"
            }, {
                status: 400
            });
        }
        const pending = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$pending$2d$message$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            ownerId,
            to: contactNumber,
            text,
            status: "pending"
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Message queued",
            id: pending._id
        }, {
            status: 201
        });
    } catch (error) {
        console.error("[CRM POST]", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__49ad6f03._.js.map