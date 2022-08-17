const app = require("./app");
const connectWithDB = require("./config/db");
require('dotenv').config();
const cloudinary = require('cloudinary')

// Connecting with Database
connectWithDB()


// cloudinary configuration goes here
cloudinary.config({
    cloud_name:  process.env.CLOUDINARY_NAME,
    api_key:  process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at port: ${process.env.PORT}`)
})