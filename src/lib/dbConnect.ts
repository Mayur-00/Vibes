import mongoose from "mongoose";


const dbUri = process.env.DB_URI!;

if (!dbUri){
    throw new Error("provide your db connection string in enviroment variables file")
};

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null, promise:null};
};


export async function ConnectToDatabase (){
    if(cached.conn){
        return cached.conn;
    };

    if(!cached.promise){
        const opt = {
            bufferCommands:true,
            maxPoolSize:10
        };

        cached.promise = mongoose.connect(dbUri, opt).then(()=> mongoose.connection);
    };

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise= null;
        throw error
        
    };
    return cached.conn

}