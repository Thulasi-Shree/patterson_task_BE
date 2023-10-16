const catchAsyncErr = require('../middleware/catchAsyncErr');
const User = require('../modules/user');
const sendEmail = require('../utils/email');
const sendOtp = require('../utils/sendOtp')
const ErrorHandler = require('../utils/errorHandler');
const sendResToken = require('../utils/jsonWebToken');
const crypto = require('crypto')


exports.createUser = catchAsyncErr(async (req, res, next) => {

    const user = await User.create(req.body);

    //     const token = user.getJsonWebToken()

    //     res.status(200).json({
    //         status: true,
    //         data: user,
    //         token
    //     })

    // [OR]

    sendResToken(user, 200, res)

})

exports.loginUser = catchAsyncErr(async (req, res, next) => {

    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password');


    if (!user) {

        return next(new ErrorHandler('User not found!', 400))
    }

    if (!user || !password) {
        return next(new ErrorHandler('Please enter valid email and password', 401))
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Please enter valid password', 401))
    }

    sendResToken(user, 200, res)

})

exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: "Logged out successfully"
    }
    )
}


// exports.forgotPassword = catchAsyncErr(async (req, res, next)=>{
//     const user = await User.findOne({email: req.body.email})

//     if(!user){
//         return next(new ErrorHandler("User not found", 403))
//     }

//     const resetToken = user.getUserPassword();

//   //because it only generate password not validates
//     await user.save({validateBeforeSave: false})

//     //for creating rest url
//     const resetUrl = `${req.protocol}://${req.get('host')}/api/user/password/reset/update/${resetToken}`

//     //for setting message in mail.
//     const message = `Your password reset URL is: \n\n ${resetUrl} \n\n If not you, please ignore.`

//     try{
// //key word already given in sendEmail function in utiities file
//        sendEmail({
//             email: user.email,
//             subject: "Shopping cart password recovery",
//             message
//         })

//         res.status(200).json({
//             success: true,
//             message: `Email sent to ${user.email}`
    
           
//         })

//     }catch(err){
//         user.resetPassword = undefined;
//         user.resetPasswordExpire = undefined
//         await user.save({validateBeforeSave: false})
//         return next(new ErrorHandler(err.message), 500)
//     }
// })


// exports.resetPassword = catchAsyncErr( async (req, res, next) => {
//     const resetPasswordToken =  crypto.createHash('sha256').update(req.params.token).digest('hex'); 
//     console.log(`Reset Password Token: ${resetPasswordToken}`);
//      const user = await User.findOne( {
//          resetPasswordToken,
        
//          resetPasswordTokenExpire: {
//              $gt : Date.now() 
//          }
//      } )
 
//      if(!user) {
//         console.log(res)
//          return next(new ErrorHandler('Password reset token is invalid or expired'));
//      }
 
//      if( req.body.password !== req.body.confirmPassword) {
//          return next(new ErrorHandler('Password does not match'));
//      }
 
//      user.password = req.body.password;
//      user.resetPassword = undefined;
//      user.resetPasswordExpire = undefined;
//      await user.save({validateBeforeSave: false})
//      sendResToken(user, 200, res)
 
//  })



 exports.forgotPassword = catchAsyncErr(async (req, res, next) => {
     const user = await User.findOne({ phone: req.body.phone });
 
     if (!user) {
         return next(new ErrorHandler("User not found", 403));
     }
 
     const otp = Math.floor(100000 + Math.random() * 900000);
     user.otp = otp;
     await user.save();
 
     try {
         const formattedPhoneNumber = `+91${user.phone}`; 
         await sendOtp(formattedPhoneNumber, otp);
 
         res.status(200).json({
             success: true,
             message: `OTP sent to ${formattedPhoneNumber}`,
         });
     } catch (err) {
         return next(new ErrorHandler(err.message), 500);
     }
 });
 

 const OTP_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // OTP expires after 7 days (in milliseconds)

 exports.resetPassword = catchAsyncErr(async (req, res, next) => {
     const { phone, otp, password, confirmPassword } = req.body;
 
     // Find the user by OTP and phone number
     const user = await User.findOne({ phone, otp });
     if (!user) {
        return next(new ErrorHandler('Invalid OTP', 400));
    }
      
     // Check if the OTP has expired
     const otpSentTime = user.otpSentAt;
     const currentTime = Date.now();
     if (currentTime - otpSentTime > OTP_EXPIRY_TIME) {
         return next(new ErrorHandler('OTP has expired', 400));
     }

    
 
     // Check if the passwords match
     
     if (password !== confirmPassword) {
         return next(new ErrorHandler('Passwords do not match', 400));
     }
 
     // Update the user's password and clear OTP fields
     user.password = password;
     user.otp = undefined;
     user.otpSentAt = undefined; // Clear the OTP sent time
     await user.save();
 
     res.status(200).json({
         success: true,
         message: 'Password reset successfully',
     });
 });
 