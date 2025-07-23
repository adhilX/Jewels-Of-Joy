const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

//password Hashing

const securePassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10)

  } catch (error) {
    console.error('Error hashing password', error);
    return null;

  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//Email sender

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
})

const generateOtpEmail = (otp) => {
  return `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jewels of Joy - Email Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
      color: #444;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background-color: #fff8f5;
      text-align: center;
      padding: 30px 20px 10px;
      border-bottom: 1px solid #eee;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      color: #b48660;
      font-weight: 600;
    }
    .content {
      padding: 30px 40px;
      text-align: center;
    }
    .content h2 {
      font-size: 22px;
      color: #333;
      margin-bottom: 15px;
    }
    .message {
      font-size: 15px;
      color: #555;
      margin-bottom: 20px;
    }
    .otp-box {
      background-color: #f9f3f0;
      border: 1px dashed #d4a373;
      color: #b86e3f;
      font-size: 28px;
      font-weight: bold;
      padding: 16px 0;
      margin: 20px auto;
      letter-spacing: 6px;
      border-radius: 8px;
      width: 60%;
    }
    .note {
      font-size: 14px;
      color: #777;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #999;
      padding: 20px;
      border-top: 1px solid #eee;
      background-color: #fafafa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Jewels of Joy</h1>
    </div>
    <div class="content">
      <h2>Email Verification</h2>
      <p class="message">
        We're happy to have you with us. Please use the code below to verify your email address:
      </p>
      <div class="otp-box">${otp}</div>
      <p class="message">This code is valid for 2 minutes.</p>
      <p class="note">For your security, please do not share this code with anyone.</p>
    </div>
    <div class="footer">
      <p>This email was sent from a notification-only address. Please do not reply.</p>
      <p>&copy; ${new Date().getFullYear()} Jewels of Joy. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

  `;
};

async function sendVerificationEmail(email, otp) {
  try {

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Verify your account',
      html: generateOtpEmail(otp)

    })
    return info.accepted.length > 0;
  } catch (error) {
    console.error('Error sending email', error);
    return false;
  }
}

function isOtpExpired(otpGeneratedTime) {
  const OTP_VALIDITY_DURATION = 2 * 60 * 1000; // 2 minutes
  return Date.now() - otpGeneratedTime > OTP_VALIDITY_DURATION;
}

module.exports = {
  securePassword,
  sendVerificationEmail,
  generateOtp,
  isOtpExpired
}