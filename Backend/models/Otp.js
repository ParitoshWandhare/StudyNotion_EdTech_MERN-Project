const mongoose = require("mongoose")
const mailSender =  require("../utils/mailSender")
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60 * 5 // 5 minutes
    }
},{
    timestamps:true
})


// function => to send emails
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verfication email from Paritosh",emailTemplate(otp))
            console.log("mail sent successfully: ",mailResponse)
    }
    catch(error){
        console.log("error occured while sending email: ",error)
        throw error
    }
}

OtpSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});



module.exports = mongoose.model("Otp", OtpSchema)


