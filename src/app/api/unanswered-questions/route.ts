import connectDb from "@/lib/db";
import UnansweredQuestion from "@/model/unanswered-question.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const ownerId = req.nextUrl.searchParams.get("ownerId");
        if (!ownerId) {
            return NextResponse.json(
                { message: "ownerId is required" },
                { status: 400 }
            );
        }

        await connectDb();
        const questions = await UnansweredQuestion.find({ ownerId, status: "unanswered" })
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json(
            { message: `Error fetching unanswered questions: ${error}` },
            { status: 500 }
        );
    }
}
