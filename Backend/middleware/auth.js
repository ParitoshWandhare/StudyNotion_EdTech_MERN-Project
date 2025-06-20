const jwt = require('jsonwebtoken');
require("dotenv").config()
const User = require('../models/User');


//auth

exports.auth = async(req,res,next)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Please login to access this resource"
            })
        }
        
        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode
            return next()
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
    
}

//isStudent

exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(403).json({
                success:false,
                message:"Protected route for students only"
            })
        }
        return next()
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

//isInstructor

exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(403).json({
                success:false,
                message:"Protected route for instructors only"
            })
        }
        return next()
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

//isAdmin

exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(403).json({
                success:false,
                message:"Protected route for admin only"
            })
        }
        return next()
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}