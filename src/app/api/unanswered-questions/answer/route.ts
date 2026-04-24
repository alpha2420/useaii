import connectDb from "@/lib/db";
import UnansweredQuestion from "@/model/unanswered-question.model";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { questionId, ownerId, answer } = await req.json();

        if (!questionId || !ownerId || !answer) {
            return NextResponse.json(
                { message: "questionId, ownerId, and answer are required" },
                { status: 400 }
            );
        }

        await connectDb();

        // Update the question record
        const question = await UnansweredQuestion.findByIdAndUpdate(
            questionId,
            { status: "answered", answer },
            { new: true }
        );

        if (!question) {
            return NextResponse.json(
                { message: "Question not found" },
                { status: 404 }
            );
        }

        // Append Q&A to the knowledge base
        const qaPair = `\n\nQ: ${question.question}\nA: ${answer}`;
        
        let updatedSettings = await Settings.findOne({ ownerId });
        if (!updatedSettings) {
            updatedSettings = new Settings({ ownerId, knowledge: "" });
        }
        
        updatedSettings.knowledge = (updatedSettings.knowledge || "") + qaPair;
        await updatedSettings.save();

        // Re-index RAG chunks so the new answer is immediately searchable
        try {
            const KnowledgeChunk = (await import("@/model/knowledge.model")).default;
            const { getEmbedding, chunkText } = await import("@/lib/embeddings");
            const newChunks = chunkText(qaPair, 500);
            const chunkDocs = await Promise.all(
                newChunks.map(async (text) => {
                    try {
                        const embedding = await getEmbedding(text);
                        return { ownerId, chunkText: text, embedding };
                    } catch { return null; }
                })
            );
            const valid = chunkDocs.filter(c => c !== null);
            if (valid.length > 0) {
                await KnowledgeChunk.insertMany(valid);
                console.log(`[RAG] Re-indexed ${valid.length} new chunk(s) after answer submission.`);
            }
        } catch (ragErr) {
            console.error("[RAG] Re-index error after answer:", ragErr);
        }

        return NextResponse.json({
            question,
            updatedKnowledge: updatedSettings?.knowledge || ""
        });
    } catch (error) {
        return NextResponse.json(
            { message: `Error answering question: ${error}` },
            { status: 500 }
        );
    }
}
