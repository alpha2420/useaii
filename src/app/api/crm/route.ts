import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Conversation from "@/model/conversation.model";
import PendingMessage from "@/model/pending-message.model";
import { getSession } from "@/lib/getSession";

// ─── GET /api/crm — Contacts list + stats ────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const ownerId = session.user.id;

        await connectDb();

        const { searchParams } = new URL(req.url);
        const stage = searchParams.get("stage");
        const leadScore = searchParams.get("leadScore");
        const contactNumber = searchParams.get("contactNumber"); // fetch single convo with messages

        // ── Single conversation with full messages ─────────────────────────
        if (contactNumber) {
            const convo = await Conversation.findOne({ ownerId, contactNumber }).lean();
            if (!convo) return NextResponse.json({ message: "Not found" }, { status: 404 });
            return NextResponse.json(convo);
        }

        // ── Contacts list ──────────────────────────────────────────────────
        const filter: Record<string, any> = { ownerId };
        if (stage) filter.stage = stage;
        if (leadScore) filter.leadScore = leadScore;

        const contacts = await Conversation.find(filter)
            .sort({ lastMessageAt: -1 })
            .limit(100)
            .select("-messages") // exclude messages for list view
            .lean();

        // Stats
        const [total, hot, warm, cold, won, newLeads] = await Promise.all([
            Conversation.countDocuments({ ownerId }),
            Conversation.countDocuments({ ownerId, leadScore: "hot" }),
            Conversation.countDocuments({ ownerId, leadScore: "warm" }),
            Conversation.countDocuments({ ownerId, leadScore: "cold" }),
            Conversation.countDocuments({ ownerId, stage: "won" }),
            Conversation.countDocuments({ ownerId, stage: "new" }),
        ]);

        return NextResponse.json({
            contacts,
            stats: { total, hot, warm, cold, won, newLeads },
        });
    } catch (error) {
        console.error("[CRM GET]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ─── PATCH /api/crm — Update stage, notes, tags, isAiPaused ─────────────────
export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const ownerId = session.user.id;

        await connectDb();

        const body = await req.json();
        const { contactNumber, stage, notes, tags, isAiPaused } = body;

        if (!contactNumber) {
            return NextResponse.json({ message: "contactNumber is required" }, { status: 400 });
        }

        const updates: Record<string, any> = {};
        if (stage !== undefined) updates.stage = stage;
        if (notes !== undefined) updates.notes = notes;
        if (tags !== undefined) updates.tags = tags;
        if (isAiPaused !== undefined) updates.isAiPaused = isAiPaused;

        const updated = await Conversation.findOneAndUpdate(
            { ownerId, contactNumber },
            { $set: updates },
            { new: true }
        ).select("-messages").lean();

        if (!updated) return NextResponse.json({ message: "Contact not found" }, { status: 404 });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[CRM PATCH]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ─── POST /api/crm — Queue an outbound message ───────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const ownerId = session.user.id;

        await connectDb();

        const { contactNumber, text } = await req.json();
        if (!contactNumber || !text) {
            return NextResponse.json({ message: "contactNumber and text are required" }, { status: 400 });
        }

        const pending = await PendingMessage.create({
            ownerId,
            to: contactNumber,
            text,
            status: "pending",
        });

        return NextResponse.json({ message: "Message queued", id: pending._id }, { status: 201 });
    } catch (error) {
        console.error("[CRM POST]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
