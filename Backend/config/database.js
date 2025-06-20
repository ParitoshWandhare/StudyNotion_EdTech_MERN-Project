const mongoose = require("mongoose")
require("dotenv").config()

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URI,{})
    .then(()=>console.log("Database connected"))
    .catch(err=>console.log(err))
}    
