const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')
const jsonWebToken = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },

    phone:{
        type: Number,
        unique: true,
        required: [true, 'Please enter your phone number.'],

    },

    email: {
        type: String,
        required: [true, 'Please enter your email id.'],
        unique: true,
        validate: [validator.isEmail, 'Please enter your valid email id.']
    },

    password: {
        type: String,
        required: [true, 'Please enter your password.'],
        maxlength: [8, 'Password cannot exceed 8 characters.'],
        select: false
    },

    avatar: {
        type: String,
        required: false
    },

    role: {
        type: String,
        default: 'User'
    },

    resetPassword:{
        type: String
    } ,

    confirmPassword:{
        type:String
    },
    otp:{
        type: Number
    },
    otpSentAt:{
        type: Date
    },

    resetPasswordExpire:{
        type: Date,
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

})

//used to hide password
// userSchema.pre('save', async function (next) {
//     this.password = await bcrypt.hash(this.password, 10)
// })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//For sequirity key for loggin, which hlps the user to stay login for particular period.
userSchema.methods.getJsonWebToken = function () {
    return jsonWebToken.sign({ id: this.id }, process.env.JSON_WEB_TOKEN_SECRECT, {
        expiresIn: process.env.JSON_WEB_TOKEN_EXPIRE_DATE
    })
}

//for password authentication
userSchema.methods.isValidPassword = async function (reqPassword) {
    return bcrypt.compare(reqPassword, this.password)
}

// for forget password
userSchema.methods.getUserPassword = function () {
    const token = crypto.randomBytes(20).toString('hex')

    // for generating and changing to hash reset token.
    this.resetPassword = crypto.createHash('sha256').update(token).digest('hex')

    //setting users current password expiry
    this.resetPasswordExpire = Date.now() + 130 * 60 * 1000 //this expires after 30 min of time

    return token

}

// userSchema.methods.getUserPassword = async function () {
//     const token = crypto.randomBytes(20).toString('hex');

//     try {
//         // Generate a salt and hash the token
//         const hashedToken = await bcrypt.hash(token, 10); // 10 is the number of salt rounds

//         // Set the hashed token in the resetPassword field
//         this.resetPassword = hashedToken;

//         // Set the reset password expiry time
//         this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // expires after 30 minutes

//         return token;
//     } catch (error) {
//         // Handle the error, usually by throwing or logging it
//         throw new Error('Error hashing reset token');
//     }
// };


let User = mongoose.model("user", userSchema)
module.exports = User