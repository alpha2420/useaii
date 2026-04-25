import connectDb from "@shared/lib/db";
import UnansweredQuestion from "@backend/models/unanswered-question.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { questionId } = await req.json();

        if (!questionId) {
            return NextResponse.json(
                { message: "questionId is required" },
                { status: 400 }
            );
        }

        await connectDb();
        await UnansweredQuestion.findByIdAndDelete(questionId);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { message: `Error deleting question: ${error}` },
            { status: 500 }
        );
    }
}
