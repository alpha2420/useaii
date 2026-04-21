import connectDb from "@/lib/db";
import Conversation from "@/model/conversation.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { ownerId, contactNumber } = await req.json();
        if (!ownerId || !contactNumber) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDb();
        
        // Delete the conversation and its messages to reset completely
        await Conversation.deleteOne({ ownerId, contactNumber });

        return NextResponse.json({ message: "Conversation reset successfully" });
    } catch (error) {
        console.error("Reset API error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
