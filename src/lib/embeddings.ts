import OpenAI from "openai";
import { env } from "./env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

/**
 * Generates a vector embedding for the given text using OpenAI's text-embedding-3-small model.
 */
export async function getEmbedding(text: string): Promise<number[]> {
    if (!env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is missing from environment variables.");
    }
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text.replace(/\n/g, " "),
    });
    return response.data[0].embedding;
}

/**
 * Calculates the cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface EliteChunk {
    text: string;
    category?: string;
    intent?: string;
    aliases?: string[];
    priority?: "high" | "medium" | "low";
    tags?: string[];
}

/**
 * Parses the Elite structured text into individual metadata-rich chunks.
 */
export function parseEliteChunks(text: string): EliteChunk[] {
    const rawChunks = text.split(/---|\n(?=CATEGORY:)/).filter(c => c.trim().length > 10);
    return rawChunks.map(chunk => {
        const lines = chunk.split("\n");
        const find = (key: string) => {
            const line = lines.find(l => l.toUpperCase().startsWith(key.toUpperCase() + ":"));
            return line ? line.split(":")[1]?.trim() : undefined;
        };
        
        // Extract the actual Q&A part for display if needed, but we store the full chunk
        return {
            text: chunk.trim(),
            category: find("CATEGORY"),
            intent: find("INTENT"),
            aliases: find("ALIASES")?.split(",").map(s => s.trim()).filter(Boolean),
            priority: find("PRIORITY")?.toLowerCase() as any,
            tags: find("TAGS")?.split(",").map(s => s.trim()).filter(Boolean)
        };
    });
}

/**
 * Splits a long text into smaller chunks for RAG processing.
 * Prioritizes Q&A units and smaller 250-char blocks.
 */
export function chunkText(text: string, chunkSize: number = 250): string[] {
    // 1. If text is already structured as Q&A, split by Q: marker to keep units whole
    if (text.includes("Q:")) {
        return text
            .split(/\n(?=Q:)/)
            .map(t => t.trim())
            .filter(t => t.length > 5);
    }

    // 2. Otherwise, split by paragraphs with a smaller 250-char limit
    const chunks: string[] = [];
    const paragraphs = text.split(/\n+/);
    
    let currentChunk = "";
    for (const p of paragraphs) {
        const trimmedP = p.trim();
        if (!trimmedP) continue;

        if ((currentChunk + trimmedP).length <= chunkSize) {
            currentChunk += (currentChunk ? "\n" : "") + trimmedP;
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = trimmedP;
            
            while (currentChunk.length > chunkSize) {
                chunks.push(currentChunk.substring(0, chunkSize));
                currentChunk = currentChunk.substring(chunkSize);
            }
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

/**
 * High-Precision Reranker (Strict Entity Matching)
 */
export function rankAndFilterChunks(
    query: string,
    chunks: { text: string; embedding: number[]; score: number }[],
    topK: number = 3
): string[] {
    if (!chunks.length) return [];

    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, "");
    const queryWords = Array.from(new Set(cleanQuery.split(/\s+/).filter(w => w.length > 3)));

    const scored = chunks.map(chunk => {
        const text = chunk.text.toLowerCase();
        let keywordBoost = 0;
        let matches = 0;
        
        // Count keyword matches (Strict 20% boost per subject match)
        queryWords.forEach(word => {
            if (text.includes(word)) {
                keywordBoost += 0.20;
                matches++;
            }
        });

        // Specificity boost: Prefer chunks that look like Q&A
        const isQA = (text.includes("q:") || text.includes("a:"));
        const specificityBoost = isQA ? 0.10 : 0;

        // Hard Penalty: If no keywords match and similarity is just "vaguely related", drop it
        const penalty = (matches === 0 && queryWords.length > 0) ? -0.15 : 0;

        const finalScore = chunk.score + keywordBoost + specificityBoost + penalty;
        return { ...chunk, finalScore };
    });

    // 1. Sort by augmented score
    scored.sort((a, b) => b.finalScore - a.finalScore);

    // 2. De-duplicate and Strict Filter
    const results: string[] = [];
    const seenFingerprints = new Set<string>();

    for (const item of scored) {
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
