import { GoogleGenAI } from "@google/genai";
import KnowledgeChunk from "@/model/knowledge.model";
import connectDb from "./db";
import { env } from "./env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

/**
 * Breaks a large text into smaller overlapping chunks.
 */
export function chunkText(text: string, maxTokens: number = 200, overlapTokens: number = 40): string[] {
    // Rough estimation: 1 word ≈ 1.3 tokens. 
    // For simplicity, we chunk by sentences or words.
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    
    // Convert token limits to word limits roughly
    const maxWords = Math.floor(maxTokens / 1.3);
    const overlapWords = Math.floor(overlapTokens / 1.3);
    
    let i = 0;
    while (i < words.length) {
        const chunkWords = words.slice(i, i + maxWords);
        chunks.push(chunkWords.join(" "));
        i += (maxWords - overlapWords);
    }
    
    return chunks;
}

/**
 * Generates a 768-dimensional embedding vector for the given text using Gemini.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await ai.models.embedContent({
            model: "text-embedding-004",
            contents: text,
        });
        
        if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
            throw new Error("Failed to generate embedding");
        }
        
        return response.embeddings[0].values;
    } catch (error) {
        console.error("Embedding generation error:", error);
        throw error;
    }
}

/**
 * Utility to process, chunk, embed, and store text in MongoDB.
 */
export async function processAndStoreText(ownerId: string, text: string, source: string = "upload") {
    await connectDb();
    
    const chunks = chunkText(text, 250, 50); // ~250 tokens per chunk
    
    console.log(`Processing ${chunks.length} chunks for ${source}...`);
    
    const itemsToSave = [];
    
    // Optional: We can do this concurrently in batches to speed up
    for (const chunk of chunks) {
        if (chunk.trim().length < 10) continue; // Skip empty/tiny chunks
        
        const embedding = await generateEmbedding(chunk);
        
        itemsToSave.push({
            ownerId,
            text: chunk,
            embedding,
            metadata: { source }
        });
    }
    
    if (itemsToSave.length > 0) {
        await KnowledgeChunk.insertMany(itemsToSave);
        console.log(`Successfully stored ${itemsToSave.length} embedded chunks.`);
    }
}

/**
 * Searches MongoDB for the most relevant text chunks using Vector Search.
 * NOTE: Requires an Atlas Vector Search Index named "vector_index" on the embedding field.
 */
export async function getRelevantContext(query: string, ownerId: string, limit: number = 4): Promise<string> {
    try {
        await connectDb();
        
        // 1. Generate embedding for user query
        const queryVector = await generateEmbedding(query);
        
        // 2. Perform Atlas Vector Search
        // Note: The index name must match what is created in MongoDB Atlas
        const pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": queryVector,
                    "numCandidates": limit * 10,
                    "limit": limit,
                    "filter": {
                        "ownerId": ownerId
                    }
                }
            },
            {
                "$project": {
                    "text": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ];
        
        const results = await KnowledgeChunk.aggregate(pipeline);
        
        // 3. Combine retrieved chunks into a single context string
        if (!results || results.length === 0) {
            return "";
        }
        
        let context = "Relevant Information: \n";
        results.forEach((res, i) => {
            // Include chunks that meet a minimum confidence score if necessary, 
            // but for now we take the top matches directly.
            context += `--- Chunk ${i + 1} (Score: ${res.score.toFixed(2)}) ---\n`;
            context += res.text + "\n\n";
        });
        
        return context;
        
    } catch (error) {
        console.error("Vector search failed. Ensure Atlas Vector Search index is created.", error);
        return ""; // Fallback to empty context if search fails
    }
}
