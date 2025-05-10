import { ConnectToDatabase } from "@/lib/dbConnect";
import { NextRequest } from "next/server";


export async function GET (request:NextRequest){

    await ConnectToDatabase();

    try {
        
    } catch (error) {
        
    }

}