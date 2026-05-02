import { NextRequest, NextResponse } from "next/server";
import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import { getSession } from "@shared/lib/getSession";
import mongoose from "mongoose";

async function guardSuperAdmin() {
    const session = await getSession();
    if (!session?.user) return null;
    await connectDb();
    const admin = await User.findById(session.user.id);
    if (!admin?.isSuperAdmin) return null;
    return { session, admin };
}

async function checkService(name: string, fn: () => Promise<any>) {
    const start = Date.now();
    try {
        await fn();
        return { name, status: "operational", latency: Date.now() - start };
    } catch (e: any) {
        return { name, status: "degraded", latency: Date.now() - start, error: e.message };
    }
}

export async function GET(req: NextRequest) {
    const ctx = await guardSuperAdmin();
    if (!ctx) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const checks = await Promise.all([
        checkService("MongoDB", async () => {
            if (mongoose.connection.readyState !== 1) throw new Error("Not connected");
        }),
        checkService("Gemini API", async () => {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
                { signal: AbortSignal.timeout(5000) }
            );
            if (!res.ok) throw new Error(`Status ${res.status}`);
        }),
        checkService("WhatsApp Gateway", async () => {
            // Check if worker is reachable by testing an internal endpoint
            const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/whatsapp/qr`, {
                signal: AbortSignal.timeout(4000)
            });
            if (res.status === 500) throw new Error("Worker error");
        }),
    ]);

    // Count users as a quick DB sanity check
    const userCount = await User.countDocuments();

    return NextResponse.json({
        services: checks,
        meta: {
            userCount,
            mongoState: mongoose.connection.readyState,
            nodeVersion: process.version,
            uptime: process.uptime(),
            memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
            checkedAt: new Date().toISOString(),
        }
    });
}
