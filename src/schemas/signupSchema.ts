import {z} from 'zod';

export const usernameValidation = z.string()
.min(4, "Username Must Be 4 charactors Long")
.max(8, "Username Could Not Be Longer Than 8 Charactors")
.regex(/^[a-zA-Z0-9_]+$/, "UserName must not contain any special Charactors");


export const signUpSchema= z.object(
    {
        username:usernameValidation,
        email:z.string().email({message:"Invalid Email Address"}),
        password:z.string().min(6, "password must be atleast 6 characters long")
    }
);
