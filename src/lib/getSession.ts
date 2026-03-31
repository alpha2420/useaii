import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return null;
    }

    return {
        user: {
            id: payload.userId,
            email: payload.email,
            name: payload.name
        }
    };
}