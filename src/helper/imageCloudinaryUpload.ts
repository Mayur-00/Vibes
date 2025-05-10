import cloudinary from "@/lib/cloudinary";

export async function imageCloudinaryUpload(file: string, title: string) {
  try {
    const fileUploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file,
        {
          resource_type: "video",
          folder: "music-streaming-app/images",
          public_id: `${Date.now()}-${title.replace(" ", "-")}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      

     
    });


    const cloudinaryResult =  fileUploadResult as {
        secure_url: string;
        format: string;
        resource_type: string;
      };


    return cloudinaryResult
  } catch (error: any) {
    throw new Error(error);
  }
}
