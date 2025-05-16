import ArtistModel from "@/app/models/artist.model";
import UserModel from "@/app/models/user.model";
import cloudinary from "@/lib/cloudinary";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request:NextRequest){
    try {
        const {username, email, password, profilePic} = await request.json();

        if(!username || !email || !password){
            return NextResponse.json(
                {error:"username, email and password is required!"},
                {status:400}
            );
        };


        await ConnectToDatabase();

    const existingUser = await ArtistModel.findOne({email:email});

    if(existingUser){
        return NextResponse.json(
            {
                error:"artist  already exist please login"
            },
            {
                status:500
            }
        );
    };

    const image = await cloudinary.uploader.upload(profilePic);

    const newArtist = await ArtistModel.create(
        {
            username,
            email,
            password,
            profilePic:image.secure_url
        }
    );

   return NextResponse.json(
    {
        message:"artist register succesfull"
    }, 
    {
        status:201
    }
   );
    } catch (error) {
        return NextResponse.json(
            {
                error:"internal server error"
            },
            {
                status:500
            }
        )
        
    }
}