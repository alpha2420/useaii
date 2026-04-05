import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Email, password, and name are required" },
                { status: 400 }
            );
        }

        await connectDb();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name
        });

        // Create JWT and set cookie
        const token = await signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        });

        const response = NextResponse.json(
            { message: "Account created successfully", user: { id: user._id, email: user.email, name: user.name } },
            { status: 201 }
        );

        response.cookies.set("access_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        return response;
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "An internal server error occurred during registration." },
            { status: 500 }
        );
    }
}
