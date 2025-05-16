import cloudinary from "@/lib/cloudinary";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import UserModel from "@/app/models/user.model";
import ArtistModel from "@/app/models/artist.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { updateProfilePic } from "@/app/types/api.types";

export async function POST(request: NextRequest) {
  await ConnectToDatabase();
  try {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { image }: updateProfilePic = await request.json();
    
      if(!image){
        return NextResponse.json(
            {
                success:false,
                error:"username not found",

            },
            {
                status:404
            }
        )
    };


    const  profilePic = await cloudinary.uploader.upload(image);

    if(!profilePic){
        return NextResponse.json(
            {
                success:false,
                error:"an error occured while updaloading profile picture",

            },
            {
                status:500
            }
        )
    }
  
    const updatedUser = await ArtistModel.findOneAndUpdate(
      { email: session.user.email },
      { image: profilePic.secure_url },
      { new: true }
    );

    if(!updatedUser){
      return NextResponse.json(
        {
          success:false,
          error:"an error occured while updating profile picture",
        },
        {
          status:500
        }
      );
    };

    return NextResponse.json(
      {
        success:true,
        message:"Profile Updated Successfully"
      },
      {
        status:201 
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success:false,
        error:"internal server error",
      },
      {
        status:500
      }
    )
  }
}
