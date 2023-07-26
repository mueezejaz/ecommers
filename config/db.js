import mongoose from "mongoose";
import  Color  from "colors";
const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.mongo_url);
        
    } catch (error) {
       console.log(`there is problem in mongoose connection${error}`.bgRed.white); 
    };
};

export default connectDB;