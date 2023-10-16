const sendResToken = (user, statusCode, res) =>{

    //for creating token
    const token = user.getJsonWebToken()

    //for setting up cookie
    const options ={
        expires: new Date(Date.now() + process.env.COOKIES_EXPIRE_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        status: true,
        data: user,
        token
    })
}

module.exports = sendResToken