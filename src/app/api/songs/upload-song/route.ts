import cloudinary from "@/lib/cloudinary";
import { ConnectToDatabase } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { cloudinarySongUpload } from "@/helper/cloudinarySongUpload";
import ArtistModel from "@/app/models/artist.model";
import SongModel from "@/app/models/song.model";
import { imageCloudinaryUpload } from "@/helper/imageCloudinaryUpload";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email|| session.user.role ==="user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ConnectToDatabase();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;
    const cover = formData.get("cover") as string;

    if (!title || !genre || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

        if (!file.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'File must be an audio file' },
        { status: 400 }
      );
    };

    const artist = await ArtistModel.findById(session.user._id);

    if(!artist){
        return NextResponse.json(
            {
                success:false,
                message:"connot find user"
            }, 
            {
                status:404
            }
        );
    };

  const result =  await cloudinarySongUpload(file);

  console.log(result);

  const image = await imageCloudinaryUpload(cover, title);

  const newSong = new SongModel(
    {
        artistId:artist._id,
        title:title,
        genre:genre,
        discription:description,
        songLink:result.secure_url,
        duration:result.duration || 0,
        coverImage:image.secure_url
    }
  );

  await newSong.save();

   return NextResponse.json(
      { success: true, song: newSong },
      { status: 201 }
    );


 
  } catch (error) {
     console.error('Error uploading song:', error);
    return NextResponse.json(
      { error: 'Failed to upload song' },
      { status: 500 }
    );
  }
}
