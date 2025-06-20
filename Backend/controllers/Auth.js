const bcrypt = require('bcrypt');
const User = require('../models/User');
const Otp = require('../models/Otp');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");

require("dotenv").config()

//send mail controller

exports.sendOtp = async (req, res) => {
    try{
        const { email } = req.body;

        //check for user existence
        const checkUserPresent = await User.findOne({email});
        
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }

        //generate OTP => brute force
        const otp = otpGenerator.generate(6, { 
            upperCase: false, 
            specialChars: false, 
            alphabets: false 
        })
        console.log("OTP Generated: ",otp)

        //check for unique otp
        const result = await Otp.findOne({otp})
        while(result){
            otp = otpGenerator.generate(6, {
                upperCase: false, 
                specialChars: false, 
                alphabets: false 
            })
            result = await Otp.findOne({otp})
        }

        const otpPayload = {email, otp}
        //save otp to db
        const otpBody = await Otp.create(otpPayload);
        console.log("OTP Body: ",otpBody)

        //return response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp
        })
            
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error during OTP generation"
        });
    }
}
 

//signup controller

exports.signup = async (req, res) => {
    try{
        //data fetch from request body
        //validate request body
        //2password validation
        //check user already exists
        //find most recent otp
        //compare otp with user input
        //hash password
        //create user
        const { firstName, 
                lastName, 
                email, 
                password, 
                confirmPassword, 
                accountType, 
                contactNumber, 
                otp 
            } = req.body

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: "User already exists"
            })
        }

        const recentOTP = await Otp.findOne({email}).sort({createdAt:-1}).limit(1)
        console.log(recentOTP)

        if(recentOTP.length == 0){
            return res.status(401).json({
                success: false,
                message: "Please generate OTP first"
            })
        } else if(otp !== recentOTP.otp){
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        //Doubtful code
        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);


        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
            
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            approved:approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user: user,
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error during Signup"
        })
    }
}


//login controller

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }


        if( await bcrypt.compare(password, user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            //generate token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "3d"
            })
            user.token = token
            user.password = undefined

            const option ={
                httpOnly: true,
                expires: new Date(Date.now() + 3*24*60*60*1000),
                sameSite: "none",
                secure: true
            }
            //create cookie and send response
            res.cookie("token", token, option).status(200).json({
                success: true,
                message: "Login successful",
                user: user,
                token: token
            })
        } else{
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }

        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error during Login"
        })
    }
}

//change password controller

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};