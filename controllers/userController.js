const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload")
const cloudinary = require('cloudinary')



exports.signup = BigPromise(async (req, res, next) =>{
    // res.send("signup route")
    // pushing files to cloudinary if present

    let result;
    if(!req.files){
        return next(new CustomError("User photo is required for signup", 400))
    }

    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return next(new CustomError("Name, email and password are required", 400))
    }


    let file = req.files.photo
    result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
        folder: "users",
        width: 150,
        crop: "scale"
    })
    
    console.log(result)
    

    
    const user = await User.create({
        name,
        email, 
        password,
        photo :{
            id: result.public_id,
            secure_id: result.secure_url
        }
    })

    cookieToken(user, res);

    res.send(user)
});