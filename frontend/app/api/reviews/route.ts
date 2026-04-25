import connectDb from "@shared/lib/db";
import Review from "@backend/models/review.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { rating, feedback } = await req.json();

        if (!rating || !feedback) {
            return NextResponse.json(
                { message: "Rating and feedback are required." },
                { status: 400 }
            );
        }

        await connectDb();
        
        await Review.create({
            rating: Number(rating),
            feedback: String(feedback).trim()
        });

        return NextResponse.json(
            { message: "Review submitted successfully!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Reviews API error:", error);
        return NextResponse.json(
            { message: "An internal server error occurred while submitting." },
            { status: 500 }
        );
    }
}
