const twilio = require('twilio');

const accountSid = 'AC3d4f5168d60ee1ccae7bcf5c41c19b05';
const authToken = '91923cfe4125908611aeeddc120cef29';
const twilioPhoneNumber = '+15415161689';

const client = new twilio(accountSid, authToken);

const sendOtp = async (recipient, otp) => {
    try {
        await client.messages.create({
            body: `Your OTP: ${otp}`,
            to: recipient,
            from: twilioPhoneNumber,
        });

        console.log('OTP sent successfully via SMS');
    } catch (error) {
        console.error('Error sending OTP via SMS:', error);
        throw new Error('Failed to send OTP');
    }
};

module.exports = sendOtp;
