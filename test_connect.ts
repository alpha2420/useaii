import { NextRequest } from "next/server";
import { POST } from "./frontend/app/api/whatsapp/connect/route";

async function run() {
    const req = {
        json: async () => ({ ownerId: "69cabe61a4e168e957b7a651" })
    } as any;
    const res = await POST(req);
    const text = await res.text();
    console.log("Status:", res.status, "Body:", text);
    process.exit(0);
}
run();
