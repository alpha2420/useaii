import { NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import Settings from "@backend/models/settings.model";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get("ownerId");

        if (!ownerId) {
            return NextResponse.json({ error: "ownerId required" }, { status: 400 });
        }

        await connectDb();
        const settings = await Settings.findOne({ ownerId });

        if (!settings) {
            return NextResponse.json({ error: "Settings not found" }, { status: 404 });
        }

        // Return only public safe info
        return NextResponse.json({
            businessName: settings.businessName,
            supportEmail: settings.supportEmail,
            // You can add more public fields here if needed
        });
    } catch (error) {
        console.error("Public settings error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
