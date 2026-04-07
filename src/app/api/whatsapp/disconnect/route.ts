import { NextRequest, NextResponse } from "next/server";
import { disconnectWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
    try {
        const { ownerId } = await req.json();

        if (!ownerId) {
            return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
        }

        await disconnectWhatsApp(ownerId);
        
        return NextResponse.json({ success: true, message: "WhatsApp session cleared." });
    } catch (e: unknown) {
        return NextResponse.json({ error: (e as Error).message || "Failed to disconnect" }, { status: 500 });
    }
}
