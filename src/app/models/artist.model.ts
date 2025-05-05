import mongoose,{Schema} from "mongoose";
import { Artist, Song } from "../types/global";
import bcrypt from "bcryptjs";
import SongModel from "./song.model";


const artistSchema:Schema<Artist> = new Schema(
    {
        artistname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        bio:{
            type:String,
            required:true
        },
        image:String,
        popularSongs:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Song"
            }
    
        ],
        role:{
            type:String,
            default:"artist"
        }
    },
    {
        timestamps:true
    }

);

artistSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next()
    };

    try {
        const hash = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, hash);
        return next()
    } catch (error) {
        return next(error as Error)
        
    }
    
});

artistSchema.methods.comparePassword = async function (candidatePassword:string){
    return bcrypt.compare(candidatePassword, this.password)
};

const ArtistModel = mongoose.models.Artist<Artist> || mongoose.model<Artist>("Artist", artistSchema);
export default ArtistModel;