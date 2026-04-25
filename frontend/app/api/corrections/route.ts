import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import AICorrection from "@backend/models/ai-correction.model";
import { getSession } from "@shared/lib/getSession";

// ─── GET /api/corrections — list all corrections ──────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDb();

        const corrections = await AICorrection.find({ ownerId: session.user.id })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ corrections });
    } catch (error) {
        console.error("[Corrections GET]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ─── POST /api/corrections — save a new correction ────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDb();

        const { contactNumber, originalQuestion, badReply, correctReply } = await req.json();

        if (!contactNumber || !originalQuestion || !badReply || !correctReply) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        if (correctReply.length > 1000) {
            return NextResponse.json({ message: "Correct reply too long (max 1000 chars)" }, { status: 400 });
        }

        const correction = await AICorrection.create({
            ownerId: session.user.id,
            contactNumber,
            originalQuestion,
            badReply,
            correctReply,
        });

        return NextResponse.json({ message: "Correction saved", correction }, { status: 201 });
    } catch (error) {
        console.error("[Corrections POST]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ─── DELETE /api/corrections — delete a correction by id ─────────────────────
export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDb();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });

        await AICorrection.deleteOne({ _id: id, ownerId: session.user.id });

        return NextResponse.json({ message: "Correction deleted" });
    } catch (error) {
        console.error("[Corrections DELETE]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
