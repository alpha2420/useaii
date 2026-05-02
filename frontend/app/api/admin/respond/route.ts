import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import UnansweredQuestion from "@backend/models/unanswered-question.model";
import AuditLog from "@backend/models/audit-log.model";
import { getSession } from "@shared/lib/getSession";

async function guardSuperAdmin() {
    const session = await getSession();
    if (!session?.user) return null;
    await connectDb();
    const admin = await User.findById(session.user.id);
    if (!admin?.isSuperAdmin) return null;
    return { session, admin };
}

// GET: Fetch all unanswered questions across all users
export async function GET(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");
    const status = searchParams.get("status") || "unanswered";

    const query: any = { status };
    if (ownerId) query.ownerId = ownerId;

    const questions = await UnansweredQuestion.find(query)
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

    // Attach owner info to each question
    const ownerIds = [...new Set(questions.map((q: any) => q.ownerId))];
    const owners = await User.find({ _id: { $in: ownerIds } }).select("name email").lean();
    const ownerMap: Record<string, any> = {};
    owners.forEach((o: any) => { ownerMap[o._id.toString()] = o; });

    const enriched = questions.map((q: any) => ({
        ...q,
        ownerName: ownerMap[q.ownerId]?.name || "Unknown",
        ownerEmail: ownerMap[q.ownerId]?.email || "",
    }));

    return NextResponse.json(enriched);
}

// POST: Answer a question and mark it answered
export async function POST(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { questionId, answer } = await req.json();
    if (!questionId || !answer) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const question = await UnansweredQuestion.findByIdAndUpdate(
        questionId,
        { $set: { answer, status: "answered" } },
        { new: true }
    );

    if (!question) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await AuditLog.create({
        actorId: ctx.session.user.id,
        actorEmail: ctx.session.user.email,
        actorName: ctx.session.user.name,
        action: "ANSWER_QUESTION",
        targetId: question.ownerId,
        details: `Answered: "${question.question.slice(0, 80)}"`,
    });

    return NextResponse.json({ ok: true });
}
