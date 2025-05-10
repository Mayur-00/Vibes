import cloudinary from "@/lib/cloudinary";
import { error } from "console";



export async function cloudinarySongUpload (file:File){
try {

    

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const base64File = buffer.toString('base64');
    const fileData = `data:${file.type};base64,${base64File}`;

    const fileUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            fileData,
            {
                resource_type:'video',
                folder:'music-streaming-app/songs',
                public_id:`${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`
            },
            (error, result)=>{
                if(error) reject(error)
                else resolve(result)
            }
        )
        
    });

     const cloudinaryResult = fileUploadResult as {
      secure_url: string;
      duration?: number;
      format: string;
      resource_type: string;
    };

    return cloudinaryResult;

} catch (error:any) {
    throw new Error(error)
}
}