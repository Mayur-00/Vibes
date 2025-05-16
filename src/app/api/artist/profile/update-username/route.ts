import cloudinary from "@/lib/cloudinary";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import UserModel from "@/app/models/user.model";
import ArtistModel from "@/app/models/artist.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  await ConnectToDatabase();
  try {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { username} = await request.json();

    if(!username){
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
    
  

    const updatedUser = await ArtistModel.findOneAndUpdate(
      { email: session.user.email },
      { username: username},
      { new: true }
    );

    if(!updatedUser){
      return NextResponse.json(
        {
          success:false,
          error:"an error occured while updating username",
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
