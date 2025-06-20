const User = require('../models/User');
const Otp = require('../models/Otp');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//fuction of reset password token

exports.resetPasswordToken = async(req,res)=>{
    try{
        //get email from req body
    const { email } = req.body;
    //check for user existence
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User does not exist"
        });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({email},
                                                       {token:token,
                                                        resetPasswordExpires:Date.now()+5*60*1000
                                                       },{new:true}
    )
    //create url
    const url = `http://localhost:3000/update-password/${token}`
    
    //send email with url
    await mailSender(
        email,
        "Reset Password",
        `Click on this link to reset your password: ${url}`
    )
    //return response
    return res.status(200).json({
        success: true,
        message: "Reset password link sent to your email"
    })
    }

    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

    
}

//reset password controller


exports.resetPassword = async(req,res)=>{
    try{
        //data fetch
        const {password, confirmPassword, token} = req.body;
        //validate request body
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            })
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({token:token})
        
        //if no entry - invalid token
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        //check for token expiry
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success: false,
                message: "Token expired"
            })
        }
        //hashing password & update password in db
        const hashedPassword = await bcrypt.hash(password,10)

        await User.findOneAndUpdate({token:token},
            {password:hashedPassword,
            token:undefined,
            resetPasswordExpires:undefined
        },{new:true}
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    }

    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}