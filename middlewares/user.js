const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../utils/customError");
const BigPromise = require("./bigPromise");

exports.isLoggedIn = BigPromise(async (req, res, next)=>{

    const authHeader = req.header("Authorization");

    const token = req.cookies.token || (authHeader && authHeader.replace("Bearer ", ""));

    if(!token){
        return next(new CustomError('Login to access this page '), 401)
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id)

    next();
});

exports.customRole = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new CustomError('You are not allowed to access this resourse'), 403)
        }
        next()
    }

    // if(req.user.role === 'admin'){
    //     next()
    // }
    // this approach was followed in mern
}