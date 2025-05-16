import SongModel from "@/app/models/song.model";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
  await ConnectToDatabase();

  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      !session.user ||
      !session.user.email 
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const songs = await SongModel.find()
      .sort({ createdAt: -1 })
      .populate("artistId", "title coverImage");

    if (!songs) {
      return NextResponse.json(
        {
          success: false,
          error: "songs not found",
        },
        {
          status: 500,
        }
      );
    };


    return NextResponse.json(
        {
            success:true,
            message:"songs Founded Successfully",
            songs:songs || []
        },
        {
            status:201
        }
    );
  } catch (error) {
    return NextResponse.json(
        {
            success:false,
            message:"internal server error",
            songs:[]
        },
        {
            status:500
        }
    )
  }
}
