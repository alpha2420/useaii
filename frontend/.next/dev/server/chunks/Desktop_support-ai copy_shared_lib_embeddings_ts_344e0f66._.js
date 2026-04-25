module.exports = [
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/support-ai copy/shared/lib/env.ts [app-route] (ecmascript)");
;
async function getEmbedding(text) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }
    // Using v1beta as the models seem to be restricted to this version for this key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GEMINI_API_KEY}`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "models/text-embedding-004",
                content: {
                    parts: [
                        {
                            text: text.replace(/\n/g, " ")
                        }
                    ]
                }
            })
        });
        const data = await res.json();
        if (data.error) {
            console.error(`Gemini Embedding API Error: ${data.error.message}`);
            // Fallback to older model if 004 fails
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$support$2d$ai__copy$2f$shared$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GEMINI_API_KEY}`;
            const fRes = await fetch(fallbackUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "models/gemini-embedding-001",
                    content: {
                        parts: [
                            {
                                text: text.replace(/\n/g, " ")
                            }
                        ]
                    }
                })
            });
            const fData = await fRes.json();
            if (fData.error) throw new Error(`Gemini Embedding Fallback Error: ${fData.error.message}`);
            return fData.embedding.values;
        }
        return data.embedding.values;
    } catch (e) {
        console.error("Embedding fetch failed:", e);
        throw e;
    }
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
];

//# sourceMappingURL=Desktop_support-ai%20copy_shared_lib_embeddings_ts_344e0f66._.js.map