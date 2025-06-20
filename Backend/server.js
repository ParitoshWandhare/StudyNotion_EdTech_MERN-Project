const express = require('express');
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const userRoutes = require('./routes/User')
const profileRoutes = require('./routes/Profile')
const paymentRoutes = require('./routes/Payments')
const courseRoutes = require('./routes/Course')


const database =require('./config/database')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {cloudinaryConnect} = require('./config/cloudinary')
const fileUpload = require('express-fileupload')

const PORT = process.env.PORT || 5000

database.connect()

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    //origin: process.env.FRONTEND_URL,
    origin: "*",
    credentials: true,
}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))


cloudinaryConnect()

app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/payment', paymentRoutes)

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "Your server is running"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})