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
"[project]/Desktop/support-ai copy/backend/models/settings.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const settingsSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    ownerId: {
        type: String,
        required: true,
        unique: true
    },
    businessName: {
        type: String
    },
    supportEmail: {
        type: String
    },
    knowledge: {
        type: String
    },
    whatsappNumber: {
        type: String
    },
    agentInstructions: {
        type: String,
        default: ""
    },
    mediaLinks: {
        type: [
            {
                name: String,
                url: String
            }
        ],
        default: []
    },
    aiOverrides: {
        type: [
            {
                topic: String,
                response: String
            }
        ],
        default: []
    }
}, {
    timestamps: true
});
const Settings = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.Settings || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("Settings", settingsSchema);
const __TURBOPACK__default__export__ = Settings;
}),
"[project]/Desktop/support-ai copy/backend/models/unanswered-question.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const unansweredQuestionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    question: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: [
            "widget",
            "whatsapp"
        ],
        default: "widget"
    },
    status: {
        type: String,
        enum: [
            "unanswered",
            "answered"
        ],
        default: "unanswered"
    },
    answer: {
        type: String
    },
    // Smart learning fields
    frequency: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
        default: "unknown"
    },
    embedding: {
        type: [
            Number
        ],
        default: []
    },
    similarGroup: {
        type: String,
        index: true
    }
}, {
    timestamps: true
});
const UnansweredQuestion = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.UnansweredQuestion || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("UnansweredQuestion", unansweredQuestionSchema);
const __TURBOPACK__default__export__ = UnansweredQuestion;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/promises [external] (node:stream/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/promises", () => require("node:stream/promises"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/Desktop/support-ai copy/backend/models/cached-response.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const CachedResponseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    normalizedQuestion: {
        type: String,
        required: true
    },
    intent: {
        type: String,
        index: true
    },
    questionEmbedding: {
        type: [
            Number
        ],
        required: true
    },
    reply: {
        type: String,
        required: true
    },
    hitCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: ()=>new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        index: {
            expires: 0
        }
    }
}, {
    timestamps: true
});
// Compound index: fast lookup by owner + question
CachedResponseSchema.index({
    ownerId: 1,
    normalizedQuestion: 1
}, {
    unique: true
});
const CachedResponse = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.CachedResponse || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("CachedResponse", CachedResponseSchema);
const __TURBOPACK__default__export__ = CachedResponse;
}),
"[project]/Desktop/support-ai copy/shared/lib/embeddings.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chunkText",
    ()=>chunkText,
    "cosineSimilarity",
    ()=>cosineSimilarity,
    "getEmbedding",
    ()=>getEmbedding,
    "parseEliteChunks",
    ()=>parseEliteChunks,
    "rankAndFilterChunks",
    ()=>rankAndFilterChunks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/env.ts [app-route] (ecmascript)");
;
;
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].OPENAI_API_KEY
});
async function getEmbedding(text) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is missing from environment variables.");
    }
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text.replace(/\n/g, " ")
    });
    return response.data[0].embedding;
}
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for(let i = 0; i < vecA.length; i++){
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
function parseEliteChunks(text) {
    const rawChunks = text.split(/---|\n(?=CATEGORY:)/).filter((c)=>c.trim().length > 10);
    return rawChunks.map((chunk)=>{
        const lines = chunk.split("\n");
        const find = (key)=>{
            const line = lines.find((l)=>l.toUpperCase().startsWith(key.toUpperCase() + ":"));
            return line ? line.split(":")[1]?.trim() : undefined;
        };
        // Extract the actual Q&A part for display if needed, but we store the full chunk
        return {
            text: chunk.trim(),
            category: find("CATEGORY"),
            intent: find("INTENT"),
            aliases: find("ALIASES")?.split(",").map((s)=>s.trim()).filter(Boolean),
            priority: find("PRIORITY")?.toLowerCase(),
            tags: find("TAGS")?.split(",").map((s)=>s.trim()).filter(Boolean)
        };
    });
}
function chunkText(text, chunkSize = 250) {
    // 1. If text is already structured as Q&A, split by Q: marker to keep units whole
    if (text.includes("Q:")) {
        return text.split(/\n(?=Q:)/).map((t)=>t.trim()).filter((t)=>t.length > 5);
    }
    // 2. Otherwise, split by paragraphs with a smaller 250-char limit
    const chunks = [];
    const paragraphs = text.split(/\n+/);
    let currentChunk = "";
    for (const p of paragraphs){
        const trimmedP = p.trim();
        if (!trimmedP) continue;
        if ((currentChunk + trimmedP).length <= chunkSize) {
            currentChunk += (currentChunk ? "\n" : "") + trimmedP;
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = trimmedP;
            while(currentChunk.length > chunkSize){
                chunks.push(currentChunk.substring(0, chunkSize));
                currentChunk = currentChunk.substring(chunkSize);
            }
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}
function rankAndFilterChunks(query, chunks, topK = 3) {
    if (!chunks.length) return [];
    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, "");
    const queryWords = Array.from(new Set(cleanQuery.split(/\s+/).filter((w)=>w.length > 3)));
    const scored = chunks.map((chunk)=>{
        const text = chunk.text.toLowerCase();
        let keywordBoost = 0;
        let matches = 0;
        // Count keyword matches (Strict 20% boost per subject match)
        queryWords.forEach((word)=>{
            if (text.includes(word)) {
                keywordBoost += 0.20;
                matches++;
            }
        });
        // Specificity boost: Prefer chunks that look like Q&A
        const isQA = text.includes("q:") || text.includes("a:");
        const specificityBoost = isQA ? 0.10 : 0;
        // Hard Penalty: If no keywords match and similarity is just "vaguely related", drop it
        const penalty = matches === 0 && queryWords.length > 0 ? -0.15 : 0;
        const finalScore = chunk.score + keywordBoost + specificityBoost + penalty;
        return {
            ...chunk,
            finalScore
        };
    });
    // 1. Sort by augmented score
    scored.sort((a, b)=>b.finalScore - a.finalScore);
    // 2. De-duplicate and Strict Filter
    const results = [];
    const seenFingerprints = new Set();
    for (const item of scored){
        // Discard low-relevance noise (Threshold increased to 0.78 for precision)
        if (item.finalScore < 0.78) continue;
        const fingerprint = item.text.trim().slice(0, 40).toLowerCase();
        if (seenFingerprints.has(fingerprint)) continue;
        seenFingerprints.add(fingerprint);
        results.push(item.text);
        if (results.length >= topK) break;
    }
    return results;
}
}),
"[project]/Desktop/support-ai copy/backend/services/responseCache.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCachedReply",
    ()=>getCachedReply,
    "normalizeQuestion",
    ()=>normalizeQuestion,
    "setCachedReply",
    ()=>setCachedReply
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$cached$2d$response$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/cached-response.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/embeddings.ts [app-route] (ecmascript)");
;
;
function normalizeQuestion(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, "") // strip punctuation
    .replace(/\s+/g, " ") // collapse whitespace
    .trim().slice(0, 150); // cap key length to 150 chars
}
async function getCachedReply(ownerId, question, existingEmbedding, intent) {
    try {
        const key = normalizeQuestion(question);
        if (key.length < 3) return null;
        // 1. Intent-Bucket Match (Highest Hit Rate)
        if (intent && intent !== "unknown") {
            const intentMatch = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$cached$2d$response$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
                ownerId,
                intent
            }, {
                $inc: {
                    hitCount: 1
                }
            }, {
                new: true,
                sort: {
                    updatedAt: -1
                }
            }).lean();
            if (intentMatch) {
                console.log(`[Cache] INTENT bucket hit for "${intent}"`);
                return intentMatch.reply;
            }
        }
        // 2. Exact Match Check (Fastest)
        const exactMatch = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$cached$2d$response$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            ownerId,
            normalizedQuestion: key
        }, {
            $inc: {
                hitCount: 1
            }
        }, {
            new: true
        }).lean();
        if (exactMatch) {
            console.log(`[Cache] EXACT hit for "${key}"`);
            return exactMatch.reply;
        }
        // 3. Semantic Match Check (Using Vectors)
        const queryEmbedding = existingEmbedding || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEmbedding"])(question);
        // Fetch recent caches for this owner to compare similarities
        const recentCaches = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$cached$2d$response$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            ownerId
        }).sort({
            updatedAt: -1
        }).limit(40).lean();
        for (const cache of recentCaches){
            const similarity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cosineSimilarity"])(queryEmbedding, cache.questionEmbedding);
            if (similarity > 0.88) {
                console.log(`[Cache] SEMANTIC hit! Similarity: ${similarity.toFixed(3)} | Match: "${cache.normalizedQuestion}"`);
                await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$cached$2d$response$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateOne({
                    _id: cache._id
                }, {
                    $inc: {
                        hitCount: 1
                    }
                });
                return cache.reply;
            }
        }
        return null;
    } catch (e) {
        console.warn("[Cache] Read error:", e);
        return null;
    }
}
async function setCachedReply(ownerId, question, reply, existingEmbedding, intent) {
    try {
        const key = normalizeQuestion(question);
        if (key.length < 3 || !reply) return;
        const embedding = existingEmbedding || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEmbedding"])(question);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$cached$2d$response$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            ownerId,
            normalizedQuestion: key
        }, {
            $set: {
                reply,
                intent: intent && intent !== "unknown" ? intent : undefined,
                questionEmbedding: embedding,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            $setOnInsert: {
                ownerId,
                normalizedQuestion: key,
                hitCount: 0
            }
        }, {
            upsert: true
        });
        if (intent && intent !== "unknown") {
            console.log(`[Cache] SAVED canonical reply for bucket: "${intent}"`);
        } else {
            console.log(`[Cache] SAVED semantic reply for "${key}"`);
        }
    } catch (e) {
        console.warn("[Cache] Write error:", e);
    }
}
}),
"[project]/Desktop/support-ai copy/backend/services/preprocessMessage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "preprocessMessage",
    ()=>preprocessMessage
]);
/**
 * preprocessMessage.ts
 * Cleans and normalizes raw customer input before sending to AI.
 * Goal: reduce token count, improve AI accuracy, remove noise.
 */ // ── Common WhatsApp slang & shorthand expansions ──────────────────────────────
const SLANG_MAP = {
    "wats": "what is",
    "wat": "what",
    "wht": "what",
    "ur": "your",
    "u": "you",
    "r": "are",
    "pls": "please",
    "plz": "please",
    "plss": "please",
    "thx": "thanks",
    "ty": "thank you",
    "thnx": "thanks",
    "thnks": "thanks",
    "cn": "can",
    "cud": "could",
    "wud": "would",
    "shud": "should",
    "nd": "and",
    "n": "and",
    "hw": "how",
    "hru": "how are you",
    "btw": "by the way",
    "asap": "as soon as possible",
    "info": "information",
    "msg": "message",
    "num": "number",
    "no": "number",
    "prob": "problem",
    "prb": "problem",
    "bro": "",
    "yaar": "",
    "hmm": "",
    "umm": "",
    "ummm": "",
    "uhh": "",
    "like": "",
    "ok": "",
    "okay": "",
    "hii": "hi",
    "helo": "hello",
    "helllo": "hello",
    "helloo": "hello",
    "thr": "there",
    "gr8": "great",
    "nw": "now",
    "tmr": "tomorrow",
    "tmrw": "tomorrow",
    "ya": "yes",
    "yep": "yes",
    "nope": "no",
    "cant": "cannot",
    "wont": "will not",
    "dont": "do not",
    "didnt": "did not",
    "isnt": "is not",
    "arent": "are not",
    "refund": "refund"
};
// ── Filler phrases to remove entirely ────────────────────────────────────────
const FILLER_PHRASES = [
    "you know",
    "i mean",
    "kind of",
    "sort of",
    "by the way",
    "just wanted to",
    "i just",
    "can you please",
    "could you please",
    "would you please",
    "hey there",
    "hi there"
];
function preprocessMessage(raw) {
    if (!raw || typeof raw !== "string") return "";
    let text = raw;
    // 1. Truncate extremely long messages (prevents token explosion)
    if (text.length > 400) {
        text = text.slice(0, 400);
    }
    // 2. Remove emojis and non-ASCII decorative characters
    //    (keep basic punctuation, letters, numbers)
    text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, " ");
    // 3. Lowercase
    text = text.toLowerCase();
    // 4. Fix repeated punctuation: "?????" → "?", "!!!" → "!", "..." → "."
    text = text.replace(/\?{2,}/g, "?");
    text = text.replace(/!{2,}/g, "!");
    text = text.replace(/\.{2,}/g, ".");
    text = text.replace(/,{2,}/g, ",");
    // 5. Remove filler phrases
    for (const phrase of FILLER_PHRASES){
        text = text.replace(new RegExp(`\\b${phrase}\\b`, "gi"), " ");
    }
    // 6. Expand slang word by word
    text = text.split(/\s+/).map((word)=>{
        // Strip trailing punctuation before lookup
        const punctMatch = word.match(/^([a-z']+)([?!.,]*)$/);
        if (punctMatch) {
            const base = punctMatch[1];
            const punct = punctMatch[2];
            const expanded = SLANG_MAP[base];
            if (expanded !== undefined) {
                return expanded ? expanded + punct : ""; // empty string removes the word
            }
        }
        return word;
    }).filter(Boolean) // remove empty strings (filler words)
    .join(" ");
    // 7. Collapse multiple spaces
    text = text.replace(/\s{2,}/g, " ").trim();
    // 8. If the cleaned message is too short or meaningless, return original
    //    (safety — never return an empty string to the AI)
    if (text.length < 3) {
        return raw.slice(0, 300).trim();
    }
    return text;
}
}),
"[project]/Desktop/support-ai copy/backend/models/knowledge.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const KnowledgeChunkSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    chunkText: {
        type: String,
        required: true
    },
    embedding: {
        type: [
            Number
        ],
        required: true
    },
    category: {
        type: String,
        index: true
    },
    aliases: {
        type: [
            String
        ]
    },
    intent: {
        type: String,
        index: true
    },
    priority: {
        type: String,
        enum: [
            "high",
            "medium",
            "low"
        ],
        default: "medium"
    },
    tags: {
        type: [
            String
        ]
    }
}, {
    timestamps: true
});
// Index for fast lookup by owner
KnowledgeChunkSchema.index({
    ownerId: 1
});
const KnowledgeChunk = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.KnowledgeChunk || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("KnowledgeChunk", KnowledgeChunkSchema);
const __TURBOPACK__default__export__ = KnowledgeChunk;
}),
"[project]/Desktop/support-ai copy/shared/lib/intentClassifier.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Rule-based Intent Classifier
 * Classifies a user message into a known intent without any LLM call.
 * Returns a predefined reply string if intent is matched, or null to fall through to AI.
 */ __turbopack_context__.s([
    "classifyIntent",
    ()=>classifyIntent,
    "getIntentReply",
    ()=>getIntentReply
]);
const INTENT_RULES = [
    {
        intent: "greeting",
        pattern: /^\s*(hello|hi|hey|hiya|howdy|greetings|sup|yo|what'?s up|good (morning|afternoon|evening))\s*[!.?]?\s*$/i
    },
    {
        intent: "thanks",
        pattern: /^\s*(thanks|thank you|thx|ty|thank u|great|awesome|perfect|got it|okay|ok cool|sounds good)\s*[!.?]?\s*$/i
    },
    {
        intent: "pricing",
        pattern: /\b(price|pricing|cost|how much|fee|fees|charge|charges|rate|rates|pay|payment|subscription|plan|plans|package|packages|quote)\b/i
    },
    {
        intent: "location",
        pattern: /\b(location|address|where are you|where is|find you|your office|visit|branch|branches|directions|map|nearby)\b/i
    },
    {
        intent: "timing",
        pattern: /\b(timing|hours|open|close|working hours|business hours|when are you|availability|available|what time|schedule)\b/i
    },
    {
        intent: "services",
        pattern: /\b(what do you (do|offer|provide|sell)|services|products|features|what can you|capabilities|offerings)\b/i
    },
    {
        intent: "support_contact",
        pattern: /\b(contact|reach|email|phone|call|whatsapp|talk to|speak to|human|agent|representative|support team|customer service|help desk)\b/i
    },
    {
        intent: "refund",
        pattern: /\b(refund|cancel|cancellation|return|money back|chargeback|dispute|exchange|replacement)\b/i
    },
    {
        intent: "complaint",
        pattern: /\b(not working|broken|bug|issue|problem|error|bad|wrong|terrible|awful|disappointed|worst|angry|upset|frustrated|useless)\b/i
    }
];
function classifyIntent(message) {
    for (const rule of INTENT_RULES){
        if (rule.pattern.test(message)) {
            return rule.intent;
        }
    }
    return "unknown";
}
function getIntentReply(intent, ctx) {
    const { businessName, supportEmail, whatsappNumber, knowledge } = ctx;
    const kb = knowledge.toLowerCase();
    const contactStr = `${supportEmail || "our email"}${whatsappNumber ? ` or WhatsApp us at ${whatsappNumber}` : ""}`;
    switch(intent){
        case "greeting":
            return `Hello! 👋 Welcome to ${businessName || "us"}. How can I help you today?`;
        case "thanks":
            return `You're welcome! 😊 Is there anything else I can help you with?`;
        case "support_contact":
            return `You can reach our support team at ${contactStr}. We're happy to help! 🙌`;
        case "refund":
            return `For refund or cancellation requests, please contact our team directly at ${contactStr}. We'll sort it out for you.`;
        case "complaint":
            return `I'm really sorry to hear that! 😔 Please reach out to our team at ${contactStr} and we'll make it right for you.`;
        case "pricing":
            {
                // Try to extract pricing info from KB
                const hasPricing = /\b(price|cost|\$|₹|rs|inr|pricing|fee|rate|plan)\b/i.test(kb);
                if (!hasPricing) {
                    return `For pricing details, please contact us at ${contactStr} and we'll send you a quote!`;
                }
                return null; // Let AI extract precise pricing from knowledge chunks
            }
        case "location":
            {
                const hasLocation = /\b(address|location|street|city|located|office|branch)\b/i.test(kb);
                if (!hasLocation) {
                    return `We'd love to help you find us! Please contact us at ${contactStr} for our location details.`;
                }
                return null; // Let AI extract exact address from knowledge chunks
            }
        case "timing":
            {
                const hasTiming = /\b(hours|am|pm|open|close|timing|schedule|availability)\b/i.test(kb);
                if (!hasTiming) {
                    return `For our working hours, please contact us at ${contactStr}.`;
                }
                return null; // Let AI extract exact timings from knowledge chunks
            }
        case "services":
            {
                const hasServices = /\b(service|offer|provide|product|feature)\b/i.test(kb);
                if (!hasServices) {
                    return `We'd love to tell you about what we offer! Please reach out at ${contactStr}.`;
                }
                return null; // Let AI summarize services from knowledge chunks
            }
        default:
            return null; // Unknown intent — pass to AI
    }
}
}),
"[project]/Desktop/support-ai copy/shared/lib/hardcodedRules.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Elite 50-Query Hardcoded Rule Engine
 * Bypasses AI/RAG for the most common business queries.
 */ __turbopack_context__.s([
    "ELITE_RULES",
    ()=>ELITE_RULES,
    "matchHardcodedIntent",
    ()=>matchHardcodedIntent
]);
const ELITE_RULES = [
    // 💰 Pricing
    {
        intent: "pricing",
        patterns: [
            "price",
            "pricing",
            "cost",
            "how much",
            "subscription",
            "fee",
            "charges",
            "plan",
            "package",
            "cheapest",
            "premium"
        ]
    },
    // 📍 Location
    {
        intent: "location",
        patterns: [
            "location",
            "address",
            "where are you",
            "office",
            "branch",
            "visit",
            "directions",
            "city"
        ]
    },
    // ⏰ Timing
    {
        intent: "timing",
        patterns: [
            "timing",
            "hours",
            "open",
            "close",
            "working hours",
            "available",
            "schedule",
            "when are you"
        ]
    },
    // 📞 Contact
    {
        intent: "contact",
        patterns: [
            "contact",
            "reach",
            "email",
            "phone",
            "whatsapp",
            "talk to",
            "speak to",
            "human",
            "agent",
            "number"
        ]
    },
    // 💳 Payments
    {
        intent: "payments",
        patterns: [
            "upi",
            "accept",
            "pay",
            "payment methods",
            "cod",
            "cash on delivery",
            "emi",
            "card",
            "bank transfer"
        ]
    },
    // 🔁 Refund / Policy
    {
        intent: "refund",
        patterns: [
            "refund",
            "cancel",
            "return policy",
            "money back",
            "cancellation",
            "refund status",
            "refund time"
        ]
    },
    // 🚀 Product / Features
    {
        intent: "services",
        patterns: [
            "what do you do",
            "features",
            "services",
            "how it works",
            "use case",
            "capabilities",
            "offerings"
        ]
    },
    // 🎯 Sales Intent
    {
        intent: "onboarding",
        patterns: [
            "demo",
            "book call",
            "schedule",
            "get started",
            "signup",
            "trial",
            "test account"
        ]
    },
    // 🛠️ Support
    {
        intent: "technical",
        patterns: [
            "not working",
            "issue",
            "error",
            "bug",
            "help",
            "broken",
            "problem",
            "cannot",
            "fix"
        ]
    },
    // ⚖️ Comparison
    {
        intent: "comparison",
        patterns: [
            "compare",
            "why you",
            "vs",
            "better than",
            "competitor",
            "difference"
        ]
    }
];
function matchHardcodedIntent(message) {
    const cleanMsg = message.toLowerCase().trim();
    for (const rule of ELITE_RULES){
        for (const pattern of rule.patterns){
            if (cleanMsg.includes(pattern)) {
                return rule.intent;
            }
        }
    }
    return null;
}
}),
"[project]/Desktop/support-ai copy/backend/models/user.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const userSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: [
            "owner",
            "admin",
            "agent",
            "viewer"
        ],
        default: "owner"
    },
    // null = top-level owner account. Set to ownerId for sub-users.
    parentOwnerId: {
        type: String,
        default: null
    },
    credits: {
        type: Number,
        default: 100000
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.User || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("User", userSchema);
const __TURBOPACK__default__export__ = User;
}),
"[project]/Desktop/support-ai copy/backend/models/usage-log.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const usageLogSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    userId: {
        type: String,
        required: true,
        index: true
    },
    model: {
        type: String,
        required: true
    },
    promptTokens: {
        type: Number,
        default: 0
    },
    completionTokens: {
        type: Number,
        default: 0
    },
    totalTokens: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: [
            "chat",
            "refine",
            "classify"
        ],
        default: "chat"
    },
    cost: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const UsageLog = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.UsageLog || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["model"])("UsageLog", usageLogSchema);
const __TURBOPACK__default__export__ = UsageLog;
}),
"[project]/Desktop/support-ai copy/shared/lib/usage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logUsage",
    ()=>logUsage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$usage$2d$log$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/usage-log.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/user.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/db.ts [app-route] (ecmascript)");
;
;
;
async function logUsage({ userId, model, promptTokens, completionTokens, type }) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const totalTokens = promptTokens + completionTokens;
        // 1. Create the log entry
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$usage$2d$log$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            userId,
            model,
            promptTokens,
            completionTokens,
            totalTokens,
            type,
            timestamp: new Date()
        });
        // 2. Deduct from user's credits
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            _id: userId
        }, {
            $inc: {
                credits: -totalTokens
            }
        });
        console.log(`[Usage] Logged ${totalTokens} tokens for user ${userId} using ${model}`);
    } catch (error) {
        console.error("[Usage] Error logging usage:", error);
    }
}
}),
"[project]/Desktop/support-ai copy/frontend/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OPTIONS",
    ()=>OPTIONS,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$settings$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/settings.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$unanswered$2d$question$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/unanswered-question.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/@google/genai/dist/node/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/@upstash/ratelimit/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/@upstash/redis/nodejs.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$responseCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/services/responseCache.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$preprocessMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/services/preprocessMessage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/embeddings.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$knowledge$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/knowledge.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$intentClassifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/intentClassifier.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$hardcodedRules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/hardcodedRules.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/user.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$usage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/usage.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Optional Rate Limiting Setup
let ratelimit = null;
if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].UPSTASH_REDIS_REST_URL && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Ratelimit"]({
        redis: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redis"].fromEnv(),
        limiter: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Ratelimit"].slidingWindow(10, "1 m"),
        analytics: true,
        prefix: "@upstash/ratelimit-support-ai"
    });
} else {
    console.warn("⚠️ Rate limiting is disabled: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are missing.");
}
async function POST(req) {
    try {
        const { message, ownerId, history } = await req.json();
        if (!message || !ownerId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "message and owner id is required"
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(ownerId);
        if (user && user.credits <= 0 && !user.isSuperAdmin) {
            console.log(`[Chat] User ${ownerId} has no credits remaining.`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                reply: "Sorry, I've reached my daily limit for today. Please try again later."
            });
        }
        const recentHistory = Array.isArray(history) ? history.slice(-2) : [];
        const memoryLines = recentHistory.map((h)=>{
            const text = h.parts?.[0]?.text || h.content || "";
            const role = h.role === "user" ? "User" : "Bot";
            return text ? `${role}: ${text.slice(0, 150)}` : null;
        }).filter(Boolean);
        const conversationMemory = memoryLines.length > 0 ? `\nCONVERSATION SO FAR:\n${memoryLines.join("\n")}\n` : "";
        // ─────────────────────────────────────────────────────────────────────
        // ── Pre-process: clean slang, emojis, filler before anything else ─────────
        const cleanMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$preprocessMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["preprocessMessage"])(message);
        console.log(`[Chat] Raw: "${message}" → Clean: "${cleanMessage}"`);
        // --- Rate Limiting ---
        if (ratelimit) {
            const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
            const { success, limit, remaining, reset } = await ratelimit.limit(`chat_${ip}`);
            if (!success) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: "Too many requests. Please try again later."
                }, {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString()
                    }
                });
            }
        }
        // ---------------------
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const setting = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$settings$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            ownerId
        });
        if (!setting) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "chat bot is not configured yet."
            }, {
                status: 400
            });
        }
        // --- Greeting short-circuit ---
        const greetingPattern = /^\s*(hello|hi|hey|hiya|howdy|greetings|sup|what'?s up|good (morning|afternoon|evening))\s*[!.?]?\s*$/i;
        if (greetingPattern.test(message)) {
            const businessName = setting.businessName || "us";
            const greetingReply = `Hello! 👋 Welcome to ${businessName}. How can I help you today?`;
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(greetingReply);
            response.headers.set("Access-Control-Allow-Origin", "*");
            response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type");
            return response;
        }
        // ------------------------------
        // --- Layer 1.5: Custom AI Overrides (User-defined Rules) ---
        if (setting.aiOverrides && setting.aiOverrides.length > 0) {
            const cleanMsg = message.toLowerCase().trim();
            const override = setting.aiOverrides.find((o)=>cleanMsg.includes(o.topic.toLowerCase().trim()));
            if (override) {
                console.log(`[Chat] Override hit for topic: "${override.topic}"`);
                const response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(override.response);
                response.headers.set("Access-Control-Allow-Origin", "*");
                response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
                response.headers.set("Access-Control-Allow-Headers", "Content-Type");
                return response;
            }
        }
        // -----------------------------------------------------------
        // --- Layer 1.7: Elite 50-Query Hardcoded Rule Engine ---
        const hardcodedIntent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$hardcodedRules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchHardcodedIntent"])(cleanMessage);
        if (hardcodedIntent) {
            console.log(`[Elite] Hardcoded match: ${hardcodedIntent}`);
            // Try to find a direct High Priority answer in the DB for this intent
            const directChunk = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$knowledge$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                ownerId,
                intent: hardcodedIntent,
                priority: "high"
            }).lean();
            if (directChunk && directChunk.chunkText.includes("A:")) {
                const answer = directChunk.chunkText.split("A:")[1]?.trim();
                if (answer) {
                    console.log(`[Elite] Zero-LLM direct answer found for intent: ${hardcodedIntent}`);
                    const response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(answer);
                    response.headers.set("Access-Control-Allow-Origin", "*");
                    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
                    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
                    return response;
                }
            }
        }
        // -----------------------------------------------------------
        // --- Layers 2-6: Rule-Based Intent Classification ---
        const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$intentClassifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyIntent"])(cleanMessage);
        console.log(`[Chat] Intent classified: "${intent}" for owner ${ownerId}`);
        const intentReply = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$intentClassifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIntentReply"])(intent, {
            businessName: setting.businessName,
            supportEmail: setting.supportEmail,
            whatsappNumber: setting.whatsappNumber,
            knowledge: setting.knowledge || ""
        });
        if (intentReply !== null) {
            console.log(`[Chat] Intent fast-return: "${intent}" — no AI call.`);
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(intentReply);
            response.headers.set("Access-Control-Allow-Origin", "*");
            response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type");
            return response;
        }
        // Only unknown intents OR knowledge-backed intents fall through to AI
        // --------------------------------------------------------------------
        // ── Cache Check (Bucket First, then Semantic) ─────
        // We pass 'undefined' for embedding initially to avoid unnecessary API calls if it's an intent hit
        const cachedAnswer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$responseCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCachedReply"])(ownerId, cleanMessage, undefined, intent);
        if (cachedAnswer) {
            const cachedResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(cachedAnswer);
            cachedResponse.headers.set("Access-Control-Allow-Origin", "*");
            cachedResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
            cachedResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
            return cachedResponse;
        }
        // --- Pre-RAG Gate: Only generate embedding if cache missed ---
        let queryEmbedding;
        try {
            queryEmbedding = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEmbedding"])(cleanMessage);
        } catch (err) {
            console.error("[Chat] Embedding generation failed:", err);
        }
        // ───────────────────────────────
        // --- RAG: Enhanced Dynamic Knowledge Retrieval ---
        let retrievedKnowledge = "";
        if (queryEmbedding) {
            try {
                const chunks = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$knowledge$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                    ownerId
                }).lean();
                if (chunks.length > 0) {
                    // 1. Calculate base semantic scores with Metadata Boosting
                    const scored = chunks.map((c)=>{
                        let score = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cosineSimilarity"])(queryEmbedding, c.embedding);
                        // Boost for matching detected intent
                        if (c.intent && (c.intent === hardcodedIntent || c.intent === intent)) {
                            score += 0.15;
                        }
                        // Boost for high-priority facts
                        if (c.priority === "high") {
                            score += 0.05;
                        }
                        return {
                            text: c.chunkText,
                            embedding: c.embedding,
                            score
                        };
                    });
                    // 2. High-precision rerank and filter (BM25-lite + De-dupe)
                    const refined = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rankAndFilterChunks"])(cleanMessage, scored, 3);
                    // ── 🚀 ZERO-LLM SELECTION LAYER ──
                    // If we have a near-perfect match (>0.94) for a Q&A unit, return answer directly
                    if (refined.length > 0) {
                        const topChunk = scored.find((s)=>s.text === refined[0]);
                        if (topChunk && topChunk.score > 0.94 && topChunk.text.includes("A:")) {
                            const directAnswer = topChunk.text.split("A:")[1]?.trim();
                            if (directAnswer) {
                                console.log(`[Zero-LLM] Selection hit! Score: ${topChunk.score.toFixed(3)} | Skipping AI.`);
                                const response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(directAnswer);
                                response.headers.set("Access-Control-Allow-Origin", "*");
                                response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
                                response.headers.set("Access-Control-Allow-Headers", "Content-Type");
                                return response;
                            }
                        }
                    }
                    // ─────────────────────────────────
                    retrievedKnowledge = refined.join("\n---\n");
                    console.log(`[RAG] Retrieved top ${refined.length} refined chunks for query.`);
                }
            } catch (ragErr) {
                console.error("[RAG] Retrieval error:", ragErr);
            }
        }
        // Fallback to simple slice if RAG retrieval returns nothing
        if (!retrievedKnowledge) {
            retrievedKnowledge = (setting.knowledge || "not provided").slice(0, 800);
        }
        const KNOWLEDGE = retrievedKnowledge || (setting.knowledge || "").slice(0, 500);
        // --- 5. Complexity Check (Intent + Subject) ---
        const complexIntents = [
            "services",
            "complaint",
            "unknown"
        ];
        const complexKeywords = /\b(why|explain|compare|elaborate|difference|reason|how to|troubleshoot)\b/i;
        const isComplex = complexIntents.includes(intent) || complexKeywords.test(cleanMessage);
        const complexity = isComplex ? "complex" : "medium";
        console.log(`[Chat] Routing: ${complexity} | Intent: ${intent}`);
        // -------------------------------------------------------
        const styleGuide = isComplex ? "2-4 sentences max." : "1-2 sentences max.";
        const prompt = `Act as Support. Select answer from INFO. Output ONLY JSON: {"canAnswer":true,"reply":".."} or {"canAnswer":false,"reply":""}.
No markdown. No filler. ${styleGuide} Use user's language.
${conversationMemory}INFO:${KNOWLEDGE}
Q:${cleanMessage}`;
        let reply = "";
        let canAnswer = true;
        let aiSuccess = false;
        // --- 1. Try Gemini (Primary, Smart Routing) ---
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GEMINI_API_KEY && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GEMINI_API_KEY !== "your_gemini_api_key_here") {
            const ai = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenAI"]({
                apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GEMINI_API_KEY
            });
            // Smart Routing: complex queries use Pro, medium use Flash
            const geminiModels = [
                "gemini-1.5-flash",
                "gemini-1.5-pro"
            ];
            const maxTokens = isComplex ? 250 : 120;
            let lastError = null;
            let geminiRes = null;
            for (const modelName of geminiModels){
                try {
                    console.log(`[Chat][${complexity}] Trying Gemini: ${modelName}`);
                    geminiRes = await ai.models.generateContent({
                        model: modelName,
                        contents: [
                            {
                                role: 'user',
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            maxOutputTokens: maxTokens
                        }
                    });
                    if (geminiRes) {
                        const usage = geminiRes.usageMetadata;
                        console.log(`[Chat] Gemini success | ${modelName} | Tokens: In=${usage?.promptTokenCount}, Out=${usage?.candidatesTokenCount}, Total=${usage?.totalTokenCount}`);
                        // Log usage to DB
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$usage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logUsage"])({
                            userId: ownerId,
                            model: modelName,
                            promptTokens: usage?.promptTokenCount || 0,
                            completionTokens: usage?.candidatesTokenCount || 0,
                            type: "chat"
                        });
                        break;
                    }
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`[Chat] Gemini model ${modelName} failed:`, apiError?.status || apiError?.message || apiError);
                }
            }
            if (geminiRes) {
                const rawReply = geminiRes.text || "Something went wrong.";
                try {
                    let cleaned = rawReply.trim();
                    if (cleaned.startsWith("```")) {
                        cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
                    }
                    const parsed = JSON.parse(cleaned);
                    canAnswer = parsed.canAnswer !== false;
                    reply = parsed.reply || rawReply;
                } catch  {
                    canAnswer = true;
                    reply = rawReply;
                }
                aiSuccess = true;
            } else {
                console.error("[Chat] Gemini failed for owner:", ownerId, lastError);
            }
        }
        // --- 2. Fallback to Groq (Fast & Reliable) ---
        if (!aiSuccess && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GROQ_API_KEY) {
            try {
                console.log(`[Chat][${complexity}] Groq fallback with llama-3.3-70b-versatile`);
                const groq = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
                    apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GROQ_API_KEY,
                    baseURL: "https://api.groq.com/openai/v1"
                });
                const completion = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    response_format: {
                        type: "json_object"
                    },
                    max_tokens: isComplex ? 250 : 120
                });
                const content = completion.choices[0].message.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    canAnswer = parsed.canAnswer !== false;
                    reply = parsed.reply || "";
                    aiSuccess = true;
                    console.log(`[Chat] Groq success | Tokens: In=${completion.usage?.prompt_tokens}, Out=${completion.usage?.completion_tokens}`);
                }
            } catch (e) {
                console.error(`[Chat] Groq fallback failed:`, e);
            }
        }
        // --- 3. Fallback to Grok (xAI) ---
        if (!aiSuccess && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GROK_API_KEY) {
            try {
                console.log(`[Chat][${complexity}] Grok fallback with grok-beta`);
                const grok = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
                    apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GROK_API_KEY,
                    baseURL: "https://api.x.ai/v1"
                });
                const completion = await grok.chat.completions.create({
                    model: "grok-beta",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    response_format: {
                        type: "json_object"
                    },
                    max_tokens: isComplex ? 250 : 120
                });
                const content = completion.choices[0].message.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    canAnswer = parsed.canAnswer !== false;
                    reply = parsed.reply || "";
                    aiSuccess = true;
                    console.log(`[Chat] Grok success | Tokens: In=${completion.usage?.prompt_tokens}, Out=${completion.usage?.completion_tokens}`);
                }
            } catch (e) {
                console.error(`[Chat] Grok fallback failed:`, e);
            }
        }
        // --- 4. Fallback to OpenAI (Smart Routing) ---
        if (!aiSuccess && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].OPENAI_API_KEY && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].OPENAI_API_KEY !== "your_openai_api_key_here") {
            try {
                // Smart Routing: complex queries use gpt-4o, medium use gpt-4o-mini
                const openaiModel = isComplex ? "gpt-4o" : "gpt-4o-mini";
                const maxTokens = isComplex ? 250 : 120;
                console.log(`[Chat][${complexity}] OpenAI fallback with ${openaiModel}`);
                const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
                    apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].OPENAI_API_KEY
                });
                const completion = await openai.chat.completions.create({
                    model: openaiModel,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    response_format: {
                        type: "json_object"
                    },
                    max_tokens: maxTokens
                });
                const content = completion.choices[0].message.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    canAnswer = parsed.canAnswer !== false;
                    reply = parsed.reply || "";
                    aiSuccess = true;
                    const usage = completion.usage;
                    console.log(`[Chat] OpenAI success | Tokens: In=${usage?.prompt_tokens}, Out=${usage?.completion_tokens}, Total=${usage?.total_tokens}`);
                    // Log usage to DB
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$usage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logUsage"])({
                        userId: ownerId,
                        model: openaiModel,
                        promptTokens: usage?.prompt_tokens || 0,
                        completionTokens: usage?.completion_tokens || 0,
                        type: "chat"
                    });
                }
            } catch (openaiError) {
                console.error(`[Chat] OpenAI fallback failed:`, openaiError?.message || openaiError);
            }
        }
        if (!aiSuccess) {
            console.error("[Chat] All AI models (Gemini & OpenAI) failed for owner:", ownerId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "The AI service is temporarily overloaded. Please try again in 1-2 minutes."
            }, {
                status: 503
            });
        }
        // If the AI couldn't answer, store with smart grouping & frequency tracking
        if (!canAnswer) {
            try {
                const SIMILARITY_THRESHOLD = 0.92;
                let matchedGroup;
                if (queryEmbedding) {
                    const existingUnanswered = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$unanswered$2d$question$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                        ownerId,
                        status: "unanswered",
                        embedding: {
                            $exists: true,
                            $not: {
                                $size: 0
                            }
                        }
                    }).lean();
                    for (const existing of existingUnanswered){
                        if (existing.embedding && existing.embedding.length > 0) {
                            const sim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cosineSimilarity"])(queryEmbedding, existing.embedding);
                            if (sim > SIMILARITY_THRESHOLD) {
                                matchedGroup = existing.similarGroup || existing._id.toString();
                                await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$unanswered$2d$question$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateOne({
                                    _id: existing._id
                                }, {
                                    $inc: {
                                        frequency: 1
                                    },
                                    $set: {
                                        similarGroup: matchedGroup
                                    }
                                });
                                console.log(`[UQ] Grouped similar question (sim=${sim.toFixed(3)}) | freq++ for "${existing.question}"`);
                                break;
                            }
                        }
                    }
                }
                if (!matchedGroup) {
                    const newDoc = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$unanswered$2d$question$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                        ownerId,
                        question: message,
                        source: "widget",
                        status: "unanswered",
                        frequency: 1,
                        category: intent,
                        embedding: queryEmbedding || []
                    });
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$unanswered$2d$question$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateOne({
                        _id: newDoc._id
                    }, {
                        $set: {
                            similarGroup: newDoc._id.toString()
                        }
                    });
                    console.log(`[UQ] New unanswered question stored | category: ${intent}`);
                }
            } catch (dbErr) {
                console.error("[Chat] Failed to store unanswered question:", dbErr);
            }
        }
        // Save to cache using the normalized cleanMessage as the key for max hit rate
        // Also save the intent bucket for canonical answers
        if (canAnswer && reply) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$responseCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setCachedReply"])(ownerId, cleanMessage, reply, queryEmbedding, intent).catch(()=>{});
        }
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(reply);
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("X-Frame-Options", "DENY");
        return response;
    } catch (error) {
        console.error("Chat API error:", error);
        const errResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "An internal server error occurred processing the chat."
        }, {
            status: 500
        });
        errResponse.headers.set("Access-Control-Allow-Origin", "*");
        errResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        errResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return errResponse;
    }
}
const OPTIONS = async ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(null, {
        status: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__394c4837._.js.map