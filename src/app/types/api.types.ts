
export interface ApiResponse{
    success?:boolean;
    message?:string;
    error?:string;
    status?:number;
};

export interface updateProfilePic {
    image:string
};

export interface playlistRequest {
    title:string;
    cover:string;
    description:string,
    songs:[];
}