import mongoose, {Schema,} from "mongoose";
import { User } from "../types/global";
import bcrypt from "bcryptjs";


const userSchema: Schema<User> = new Schema(
    {
        username:{
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
        likedSongs:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Song"
            }
        ],
        followingArtists:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Artist"
            }
        ],    
        role:{
            type:String,
            default:"user"
        }
    },
    {
        timestamps:true
    }
);


userSchema.pre('save', async function (next) {
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

userSchema.methods.comparePassword = async function (candidatePassword:string){
    return bcrypt.compare(candidatePassword, this.password)
};

const UserModel = mongoose.models.User<User> || mongoose.model<User>("User", userSchema);
export default UserModel;