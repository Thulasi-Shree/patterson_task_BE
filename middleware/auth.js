//To make the route as protected route.
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErr");
const jsonWebToken = require('jsonwebtoken')
const User = require('../modules/user');

exports.isAuthUser = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Requires login", 405))
    }

    const decodedToken = jsonWebToken.verify(token, process.env.JSON_WEB_TOKEN_SECRECT)

    req.user = await User.findById(decodedToken.id)
   
    next()
})

exports.authorizeRoles = (...roles)=>{
   return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} is not allowed`, 401))
        }
        next() 
    }
}
