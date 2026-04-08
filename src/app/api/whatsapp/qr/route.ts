import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppClient, getWhatsAppStatus } from "@/lib/whatsapp";
import connectDb from "@/lib/db";
import WhatsappStatus from "@/model/whatsapp-status.model";

export async function POST(req: NextRequest) {
    try {
        const { ownerId } = await req.json();
        
        if (!ownerId) {
            return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
        }

        await connectDb();
        const existing = await WhatsappStatus.findOne({ ownerId }).lean();

        // If a disconnect is pending or was just processed (no record), do NOT re-register.
        // Just return a clean "not connected" state and let the frontend
        // show the "Starting..." state until the user explicitly reconnects.
        if (existing?.disconnectRequested) {
            return NextResponse.json({ isReady: false, qrCode: null, disconnecting: true });
        }

        // If no record exists, don't automatically create one — the user must take action.
        // This prevents re-connecting immediately after disconnect.
        if (!existing) {
            return NextResponse.json({ isReady: false, qrCode: null, disconnecting: false });
        }

        // Normal flow: record exists and no disconnect pending — ensure worker is aware.
        await getWhatsAppClient(ownerId);
        const status = await getWhatsAppStatus(ownerId);

        return NextResponse.json(status);

    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}
