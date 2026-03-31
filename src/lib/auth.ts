import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET || "fallback_dev_secret_change_me_in_production"
);

export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}
