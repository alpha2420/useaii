import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";

export async function POST(req:NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { ownerId, businessName,supportEmail,knowledge,whatsappNumber,mediaLinks}=await req.json()
        if(!ownerId){
            return NextResponse.json(
                {message:"owner id is required"},
                {status:400}
            )
        }

        // Prevent updating data for other users
        if (session.user.id !== ownerId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

         await connectDb() 
        const settings=await Settings.findOneAndUpdate(
            {ownerId},
            {ownerId, businessName,supportEmail,knowledge,whatsappNumber,mediaLinks},
            {new:true,upsert:true}
        )
        return NextResponse.json(settings)
    } catch (error) {
        console.error("Settings API error:", error);
        return NextResponse.json(
            { message: "An internal server error occurred while updating settings." },
            { status: 500 }
        );
    }
}


