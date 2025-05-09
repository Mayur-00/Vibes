import UserModel from "@/app/models/user.model";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const usernameQueryObject = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await ConnectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = usernameQueryObject.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "invalid query parameters",
        },
        {
          status: 400,
        }
      );
    };

    const {username}= result.data;
    const user = await UserModel.findOne({username});

    if(user){
        return NextResponse.json(
            {
                success:false,
                message:`${username} is already taken`
            },
            {
                status:400
            }
        );
    };

    return NextResponse.json(
        {
            success:true, 
            message:"username is unique"
        },
        {
            status:201
        }
    );
  } catch (error) {
    return NextResponse.json(
        {
            success:false,
            message:"internal server error"
        },
        {
            status:500
        }
    )
  }
}
