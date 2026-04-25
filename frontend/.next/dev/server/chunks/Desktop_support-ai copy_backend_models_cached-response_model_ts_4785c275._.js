module.exports = [
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
];

//# sourceMappingURL=Desktop_support-ai%20copy_backend_models_cached-response_model_ts_4785c275._.js.map