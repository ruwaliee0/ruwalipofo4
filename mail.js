const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "sharanruwali01@gmail.com",
    pass: "glogggrvqyvpvjym" 
  }
});


const sendOtpEmail = async (recipientEmail, recipientName, otpCode) => {
  try {
    const mailOptions = {
      from: '"Portfolio Auth System" <no-reply@portfolio.com>',
      to: recipientEmail,
      subject: 'Your Account Verification OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Hello ${recipientName || 'User'},</h2>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 3px;">${otpCode}</h1>
          <p>This code is valid for a short time. Do not share it with anyone.</p>
          <br>
          <p>Best regards,<br><b>Portfolio Team</b></p>
        </div>
      `
    };
    

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOtpEmail };