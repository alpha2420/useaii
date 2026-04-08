import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import WhatsappStatus from "@/model/whatsapp-status.model";

// Explicitly creates a new WhatsApp session intent in the database.
// This is separate from the polling route so that a reconnect is only triggered
// by a deliberate user action, not automatically on every status poll.
export async function POST(req: NextRequest) {
    try {
        const { ownerId } = await req.json();

        if (!ownerId) {
            return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
        }

        await connectDb();

        // Upsert: either create fresh or reset an existing (possibly stale) record
        await WhatsappStatus.findOneAndUpdate(
            { ownerId },
            {
                ownerId,
                isReady: false,
                qrCode: null,
                disconnectRequested: false,
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: "WhatsApp connection initiated." });

    } catch (e: unknown) {
        return NextResponse.json({ error: (e as Error).message || "Failed to connect" }, { status: 500 });
    }
}
