import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const { ownerId, businessName,supportEmail,knowledge,whatsappNumber}=await req.json()
        if(!ownerId){
            return NextResponse.json(
                {message:"owner id is required"},
                {status:400}
            )
        }
         await connectDb() 
        const settings=await Settings.findOneAndUpdate(
            {ownerId},
            {ownerId, businessName,supportEmail,knowledge,whatsappNumber},
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


