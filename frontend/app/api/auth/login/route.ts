import connectDb from "@shared/lib/db";
import User from "@backend/models/user.model";
import { signToken } from "@shared/lib/auth";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectDb();

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Create JWT and set cookie
        const token = await signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        });

        const response = NextResponse.json(
            { message: "Login successful", user: { id: user._id, email: user.email, name: user.name } }
        );

        response.cookies.set("access_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "An internal server error occurred during login." },
            { status: 500 }
        );
    }
}