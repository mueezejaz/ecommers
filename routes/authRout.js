import express, { Router, request } from "express";
import jwt  from "jsonwebtoken";
import {registercontroller,logincontroller,testcontroller, profileupdater,} from '../controllers/authController.js';
import { requiresignin,isadmin, } from "../middleware/authmiddleware.js";
//router.object
 const router= express.Router();

//registerpage method post
router.post('/register',registercontroller)
export default router

//log in 
router.post("/login",logincontroller);

//test 

    router.get("/test",requiresignin,isadmin,testcontroller)
//protected rout
    router.get("/user-auth",requiresignin,(req,res)=>{
        res.status(200).send({ok:true}) 
    })

//protected rout for admin
router.get("/admin-auth",requiresignin,isadmin,(req,res)=>{
    res.status(200).send({ok:true}) 
})

//profilr update
router.put("/profile",profileupdater)
