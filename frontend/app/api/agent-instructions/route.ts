import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import Settings from "@backend/models/settings.model";
import { getSession } from "@shared/lib/getSession";
import { requireRole } from "@shared/lib/withRole";
 
// GET /api/agent-instructions — fetch current instructions
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
 
        await connectDb();
        const setting = await Settings.findOne({ ownerId: session.user.id })
            .select("agentInstructions businessName")
            .lean();
 
        return NextResponse.json({
            agentInstructions: setting?.agentInstructions || "",
        });
    } catch (error) {
        console.error("[Agent Instructions GET]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
 
// POST /api/agent-instructions — save instructions (admin+ only)
export async function POST(req: NextRequest) {
    try {
        // Only admin or owner can change agent instructions
        const roleCheck = await requireRole(req, "admin");
        if (roleCheck) return roleCheck;
 
        const session = await getSession();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
 
        await connectDb();
 
        const { agentInstructions } = await req.json();
        if (typeof agentInstructions !== "string") {
            return NextResponse.json({ message: "agentInstructions must be a string" }, { status: 400 });
        }
 
        if (agentInstructions.length > 2000) {
            return NextResponse.json({ message: "Agent instructions cannot exceed 2000 characters" }, { status: 400 });
        }
 
        await Settings.findOneAndUpdate(
            { ownerId: session.user.id },
            { $set: { agentInstructions } },
            { upsert: true }
        );
 
        return NextResponse.json({ message: "Agent instructions saved successfully" });
    } catch (error) {
        console.error("[Agent Instructions POST]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
