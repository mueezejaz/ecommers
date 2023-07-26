import { comparepassword, hashpassword } from "../helpers/authHELPER.js";
import userModels from "../models/userModels.js";
import jwt  from "jsonwebtoken";
export const  registercontroller = async (req,res)=>{
try {
    const {name,email,password,phone,address} = req.body
    //velidation
    if (!name) {
        return res.send({message:"Name is required"})
    };
    if (!email) {
        return res.send({message:"Email is required"})
    };
    if (!password || password.length < 6) {
        return res.send({message:"Password is required and should be grater then 6 figures"})
    };

    if (!address) {
        return res.send({message:"Address is required"})
    };
    if (!phone) {
        return res.send({message:"Phone is required"})
    };
//existing user
const existinguser = await userModels.findOne({email:email})
if(existinguser){
    return res.status(200).send({
        success:false,
        message:"Allready registered plzz login "
    })}
    //registring user
    const hashedpassword = await hashpassword(password)
    // saving
    const user =await new userModels({name,email,phone,address,password:hashedpassword}).save()
res.status(201).send({
    success:true,
    message:"user registerd sucessfully",
    user
})

} catch (error) {
   
    res.status(500).send({
        success:false,
        message:"error in registeration",
        error
    })
}
};

//log in page
export const logincontroller = async(req,res)=>{
    try {
        const {email,password}= req.body
        if (!email||!password) {
            return res.status(200).send({
                success:false,
                message:"Invalis Email and password"
            })
        }
        //check user
        const user = await userModels.findOne({email});
        if (!user) {
            return res.status(200).send({
                success:false,
                message:"Your email is not registered"
            })
        }
        const match = await comparepassword(password,user.password);
        if (!match) {
            return res.status(200).send({
                success:false,
                message:"Invalid password"
            })
        }
//token
const token = await jwt.sign({_id:user._id} , process.env.JWT_SECRET ,{
    expiresIn:"4d",
});
res.status(200).send({
    success:true,
    message:"login sucessfully",
    user:{
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role,
    },
    token,
});

    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:"error in login",
            error
        })
    }
};
//test
export const testcontroller = (req,res)=>{
res.send("test is runing")
} 

//updating user profile
export const profileupdater =async (req,res)=>{
try {
    const {name,email,password,phone,address,oldpassword} = req.body
    const user = await userModels.findById(req.user?._id)
    //password
    const hashedpassword = password ? await hashpassword(password) : undefined;
    if(!oldpassword){
        return res.send({error:`previous password is required `})
    }
    const user12 = await userModels.findOne({email});
    if (!user12) {
        return res.status(200).send({
            error:"Your email is not registered"
        })
    }
    const match = await comparepassword(oldpassword,user12.password);
    if (!match) {
        return res.status(200).send({ 
            error:"Invalid password"
        })
    }
       
       
    if(password){
        if(password?.length <6){
        return res.send({error:`password should be grater then 6 numbers`})
    }
}
    const updated_user = await userModels.findOneAndUpdate(req.user?._id,{
        name:name || user?.name,
        password:hashedpassword || user?.password,
        phone:phone || user?.phone,
        address:address || user?.address,

    },{new:true})
    res.status(200).send({
        success:true,
        message:"Profile is updated",
        updated_user,
    })
} catch (error) {
   
    res.status(400).send({
        success:false,
        message:"There is an error",
        error
    })
}
}