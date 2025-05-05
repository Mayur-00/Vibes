import mongoose, {Schema} from "mongoose";
import { Song } from "../types/global";

const songSchema: Schema<Song> = new Schema(
    {
        title:{
            type:String,
            required:true
        },
        artistId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Artist"
        },
        album:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Album"
        },
        songLink:{
            type:String,
            required:true
        },
        coverImage:String,
        duration:{
            type:Number,
            default:0,
            required:true
        },
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
            },
        ],
        playCount:{
            type:Number,
            default:0,
        }

    },
    {
        timestamps:true
    }
);

const SongModel = mongoose.models.Song<Song> || mongoose.model<Song>("Song", songSchema);

export default SongModel;