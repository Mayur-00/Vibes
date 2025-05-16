import mongoose, {Schema} from "mongoose";
import { Playlist } from "../types/global";

const playlistSchema:Schema<Playlist> = new Schema(
    {
        title:{
            type:String,
            required:true
        },
        creatorId:{
            type:String
        },
        coverImage:{
            type:String,
            default:""
        },
        description:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
);


const playlistModel = mongoose.models.Playlist<Playlist> || mongoose.model<Playlist>("Playlist", playlistSchema);

export default playlistModel;