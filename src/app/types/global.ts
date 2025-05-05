import mongoose from "mongoose";

export interface User {
    username:string;
    email:string;
    password:string;
    likedSongs:mongoose.Types.ObjectId[];
    followingArtists:mongoose.Types.ObjectId[];
    role:"user"
   
};

export interface Playlist{
    title:string;
    songs:mongoose.Schema.Types.ObjectId[];
    coverImage:string;
    creatorId:mongoose.Schema.Types.ObjectId;
    description:string;
};

export interface Song{
    title:string;
    artistId:mongoose.Types.ObjectId;
    album:mongoose.Types.ObjectId;
    songLink:string;
    coverImage:string;
    duration:Number;
    likes:mongoose.Types.ObjectId[];
    playCount:number;

};

export interface Artist {
    artistname:string;
    email:string;
    password:string
    bio:string;
    image:string;
    popularSongs:mongoose.Types.ObjectId[];
    role:"artist"
    
}
