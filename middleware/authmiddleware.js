import jwt  from "jsonwebtoken";
import userModels from "../models/userModels.js";

export const requiresignin = async (req,res,next)=>{
try {
    const decode = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
    req.user = decode;
    next();
} catch (error) {
    console.log(error)
}    
};
export const isadmin = async (req,res,next)=>{
try {
    const user =await userModels.findById(req.user._id)
    if (user.role !== 1){
     return res.status(200).send({
        success:false,
        message:"UnAuthorized Access"
     });
    }
    else{
        next();
    }
} catch (error) {
    console.log(error)
    res.send({
        success:false,
        message:"error in admin",
        error
    })
}
} 