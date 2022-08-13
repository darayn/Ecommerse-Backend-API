const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt =  require("bcryptjs")
const jwt =require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [40, 'Nae should be under 40 character']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: [validator.isEmail, 'Please enter eail in correct format'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password should atleast consist 6 characters'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo:{
        id: {
            type: String,
            required: true
        },
        secure_id: {
            type: String,
            required: true
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt:{
        type: Date,
        default: Date.now()
    }


});

// encrypt password before sving it.
// it is a hook
userSchema.pre('save', async function(next)  {
    if(!this.isModified('password')){
        return next;
    }

    this.password = await bcrypt.hash(this.password, 10)

});

// validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function(usersendpassword){
    return await bcrypt.compare(usersendpassword, this.password)
}

// create and return JWT Token

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}


// generate forgot password token(string)

userSchema.methods.getForgotPasswordToken = function(){
    // generate a long and random string
    //  there are many methods to do it, Such as nanoid, uuid id, randomstring.generate(), etc
    const forgotToken = crypto.randomBytes(20).toString('hex');
    // getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto
    .createHash('sha256')
    .update(forgotToken)
    .digest('hex')
    
    this.forgotPasswordExpiry = Date.now() + FORGOT_PASSWORD_EXPIRY
    return forgotToken;
}


module.exports = mongoose.model('User', userSchema)



// Docs - referred - https://mongoosejs.com/docs/api.html#document_Document-isModified