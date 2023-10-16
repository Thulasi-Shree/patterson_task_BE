const nodemailer = require('nodemailer')

const sendEmail = async options => {
    const transport = {
        // host: process.env.MAILTRAP_SMPT_HOST,
        // port: process.env.MAILTRAP_SMPT_PORT,
        service: 'gmail',
        auth: {
            user: process.env.MAIL_SMPT_USER,
            pass: process.env.MAIL_SMPT_PASS
        }
    } 
    const transpoter = nodemailer.createTransport(transport)
 
    const message = {
        from: `${process.env.MAIL_SMPT_FROM_NAME} <${process.env.MAIL_SMPT_FROM__EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

   await transpoter.sendMail(message)
}

module.exports = sendEmail