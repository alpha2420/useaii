module.exports = [
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
];

//# sourceMappingURL=Desktop_support-ai%20copy_backend_models_knowledge_model_ts_18a545b3._.js.map