import { ConnectToDatabase } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import SongModel from "@/app/models/song.model";

export async function GET(request: NextRequest) {
  await ConnectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(request.url);
    const songId = url.searchParams.get("songId");

    if (!songId) {
      return NextResponse.json(
        {
          sucess: false,
          message: "song id  not provided",
        },
        {
          status: 404,
        }
      );
    };

   const song = await SongModel.findById(songId);

   if(!song){
    return NextResponse.json(
        {
            success:false,
            error:"song not found"
        },
        {
            status:401
        }
    )
   };

   return NextResponse.json(
    {
        success:true,
        message:"song founded successfully",
        song:song
    },
    {
        status:200
    }
   )
  } catch (error) {
    console.log(error)
     return NextResponse.json(
    {
        success:true,
        message:"Internal server error",
        
    },
    {
        status:200
    }
   )
  }
}
