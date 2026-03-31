import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppClient, getWhatsAppStatus } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
    try {
        const { ownerId } = await req.json();
        
        if (!ownerId) {
            return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
        }

        // Initialize client if not already running (this is asynchronous)
        // If it's already running, it just returns the cached instance
        getWhatsAppClient(ownerId);
        
        // Immediately return current known status from global cache
        // The frontend should poll this endpoint every 3-5 seconds to catch updates
        const status = getWhatsAppStatus(ownerId);

        return NextResponse.json(status);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
