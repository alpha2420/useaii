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
"[project]/Desktop/support-ai copy/backend/models/whatsapp-status.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/support-ai copy/node_modules/mongoose)");
;
const WhatsappStatusSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["Schema"]({
    ownerId: {
        type: String,
        required: true,
        unique: true
    },
    isReady: {
        type: Boolean,
        default: false
    },
    qrCode: {
        type: String,
        default: null
    },
    disconnectRequested: {
        type: Boolean,
        default: false
    },
    lastPing: {
        type: Date,
        default: Date.now
    },
    providerStatus: {
        openai: {
            error: String,
            updatedAt: Date
        },
        gemini: {
            error: String,
            updatedAt: Date
        },
        grok: {
            error: String,
            updatedAt: Date
        },
        groq: {
            error: String,
            updatedAt: Date
        }
    }
}, {
    timestamps: true
});
const WhatsappStatus = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].models.WhatsappStatus || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$mongoose$29$__["default"].model('WhatsappStatus', WhatsappStatusSchema);
const __TURBOPACK__default__export__ = WhatsappStatus;
}),
"[project]/Desktop/support-ai copy/backend/services/whatsapp.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "disconnectWhatsApp",
    ()=>disconnectWhatsApp,
    "getWhatsAppClient",
    ()=>getWhatsAppClient,
    "getWhatsAppStatus",
    ()=>getWhatsAppStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$whatsapp$2d$status$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/whatsapp-status.model.ts [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const getWhatsAppClient = async (ownerId)=>{
    await connectDb();
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$whatsapp$2d$status$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
        ownerId
    });
    if (!existing) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$whatsapp$2d$status$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            ownerId,
            isReady: false,
            qrCode: null,
            disconnectRequested: false
        });
    }
    return null; // The worker process handles the actual client logic
};
const getWhatsAppStatus = async (ownerId)=>{
    await connectDb();
    const status = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$whatsapp$2d$status$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
        ownerId
    });
    if (!status || status.disconnectRequested) {
        return {
            isReady: false,
            qrCode: null
        };
    }
    return {
        isReady: status.isReady,
        qrCode: status.qrCode,
        providerStatus: status.providerStatus
    };
};
const disconnectWhatsApp = async (ownerId)=>{
    await connectDb();
    const status = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$whatsapp$2d$status$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
        ownerId
    });
    if (status) {
        status.disconnectRequested = true;
        await status.save();
    }
    return {
        success: true
    };
};
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
"[project]/Desktop/support-ai copy/frontend/app/api/whatsapp/qr/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/services/whatsapp.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$whatsapp$2d$status$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/backend/models/whatsapp-status.model.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(req) {
    try {
        const { ownerId } = await req.json();
        if (!ownerId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing ownerId"
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$models$2f$whatsapp$2d$status$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            ownerId
        }).lean();
        // If a disconnect is pending or was just processed (no record), do NOT re-register.
        // Just return a clean "not connected" state and let the frontend
        // show the "Starting..." state until the user explicitly reconnects.
        if (existing?.disconnectRequested) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                isReady: false,
                qrCode: null,
                disconnecting: true
            });
        }
        // If no record exists, don't automatically create one — the user must take action.
        // This prevents re-connecting immediately after disconnect.
        if (!existing) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                isReady: false,
                qrCode: null,
                disconnecting: false
            });
        }
        // Normal flow: record exists and no disconnect pending — ensure worker is aware.
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWhatsAppClient"])(ownerId);
        const status = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$backend$2f$services$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWhatsAppStatus"])(ownerId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(status);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c9b55ea7._.js.map