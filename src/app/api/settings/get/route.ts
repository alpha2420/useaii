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

        const {ownerId}=await req.json()
          if(!ownerId){
            return NextResponse.json(
                {message:"owner id is required"},
                {status:400}
            )
        }

        // Prevent fetching data for other users
        if (session.user.id !== ownerId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

         await connectDb() 
        const setting=await Settings.findOne(
            {ownerId}
        )
        return NextResponse.json(setting)
    } catch (error) {
         return NextResponse.json(
                {message:`get setting error ${error}`},
                {status:500}
            )
    }
}