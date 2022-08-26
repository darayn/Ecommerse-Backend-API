const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload")
const cloudinary = require('cloudinary');
const mailHelper = require("../utils/emailHelper");
const crypto = require('crypto')


exports.signup = BigPromise(async (req, res, next) =>{
    // res.send("signup route")
    // pushing files to cloudinary if present

    // let result;
    if(!req.files){
        return next(new CustomError("User photo is required for signup", 400))
    }

    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return next(new CustomError("Name, email and password are required", 400))
    }


    let file = req.files.photo
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
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


exports.login = BigPromise(async (req, res, next) => {
    const {email, password} = req.body;

    // chack for presense of email and password
    if(!email || !password){
        return next(new CustomError('Please provide both email and password', 400))
    }

    // getting user from db
    const user = await User.findOne({email}).select("+password")
    // refer this -  https://stackoverflow.com/questions/12096262/how-to-protect-the-password-field-in-mongoose-mongodb-so-it-wont-return-in-a-qu
    // if user not found in DB
    if(!user){
        return next(new CustomError('Email not registered ', 400))
    }

    // validating/ matching the password
    const isPasswordCorrect = await user.isValidatedPassword(password)

    // if password is incorrect
    if(!isPasswordCorrect){
        return next(new CustomError('Password does not match ', 400))
    }

    // if all goes good we send the token
    cookieToken(user, res); 
});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logout Success"
    })
})


exports.forgotPassword = BigPromise(async (req, res, next) => {
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user){
        return next(new CustomError('Email not registered ', 400))
    }

    const forgotToken = user.getForgotPasswordToken()

    await user.save({validateBeforeSave : false})
    const myURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    const message = `Copy paste this link in your URL and hit enter \n\n URL - ${myURL}`
    try{
        await mailHelper({
            email: user.email,
            subject : "EcommerseAPI Store | Reset Password Mail",
            message
        });
        res.status(200).json({
            success:true,
            message:"Email Sent Successfully"
        })
    }catch{
        user.forgotPasswordExpiry = undefined 
        user.forgotPasswordToken = undefined
        await user.save({validateBeforeSave: false})

        return next(new CustomError(error.message, 500))
    }
})


exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token;

    const encryToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')


    const user = await User.findOne({
        encryToken, 
        forgotPasswordExpiry : {$gt: Date.now()},
    })

    if(!user){
        return next(new CustomError('Token is invalid or expired ', 400))
    }

    if(req.body.password!== req.body.confirmPassword){
        return next(new CustomError('password and confirm password do not match', 400))
    }

    user.password = req.body.password

    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined

    await user.save()

    // send a JSON response and a token

    cookieToken(user, res);

})

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})



