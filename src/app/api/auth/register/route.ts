import UserModel from "@/app/models/user.model";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request:NextRequest){
    try {
        const {username, email, password} = await request.json();

        if(!username || !email || !password){
            return NextResponse.json(
                {error:"username, email and password is required!"},
                {status:400}
            );
        };


        await ConnectToDatabase();

    const existingUser = await UserModel.findOne({email:email});

    if(existingUser){
        return NextResponse.json(
            {
                error:"user already exist please login"
            },
            {
                status:500
            }
        );
    };

    const newUser = await UserModel.create(
        {
            username,
            email,
            password
        }
    );

   return NextResponse.json(
    {
        message:"user register succesfull"
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