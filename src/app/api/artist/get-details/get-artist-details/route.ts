import { ConnectToDatabase } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import SongModel from "@/app/models/song.model";
import ArtistModel from "@/app/models/artist.model";

export async function GET(request: NextRequest) {
  await ConnectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(request.url);
    const artistId = url.searchParams.get("artistId");

    if (!artistId) {
      return NextResponse.json(
        {
          sucess: false,
          message: "artist id  not provided",
        },
        {
          status: 404,
        }
      );
    };

   const artist = await ArtistModel.findById(artistId);

   if(!artist){
    return NextResponse.json(
        {
            success:false,
            error:"artist not found"
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
        song:artist
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
