import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import playlistModel from "@/app/models/playlist.model";
import { ApiResponse, playlistRequest } from "@/app/types/api.types";
import { cloudinarySongUpload } from "@/helper/cloudinarySongUpload";
import { imageCloudinaryUpload } from "@/helper/imageCloudinaryUpload";
import { ConnectToDatabase } from "@/lib/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<ApiResponse> {
  await ConnectToDatabase();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    };

    const {title, cover, description, songs }: playlistRequest = await request.json();

    if(!title || !cover || !description){
      return NextResponse.json(
        {
          success:false,
          error:"playlist information is required !"

        },{
          status:400
        }
      );
      
    
    };
      const userid =session.user._id; 

    if (!userid) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const UploadedCoverImage= await imageCloudinaryUpload(cover, title);

    const newPlaylist = new playlistModel(
      {
        creatorId: userid,
        description:description,
        coverImage:UploadedCoverImage.secure_url,
        title:title,
        songs:songs

      }
    );

    const savedNewPlaylist = await newPlaylist.save();
    
    return NextResponse.json(
      {
        success:true,
        message:"playlist created successfully",

      },
      {
        status:200
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success:false,
        message:"internal server error",

      },
      {
        status:500
      }
    )
  }
}

