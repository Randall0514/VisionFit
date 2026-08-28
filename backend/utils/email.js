const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'VisionFit - Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #111; margin-bottom: 5px;">VISIONFIT</h2>
        <p style="color: #666; font-size: 14px;">Verify your email address</p>
        <div style="background: #F1F3F4; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
          <p style="color: #333; font-size: 14px; margin-bottom: 10px;">Your verification code is</p>
          <p style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #111; margin: 0;">${code}</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">This code expires in 5 minutes.</p>
        <p style="color: #999; font-size: 12px; text-align: center;">If you didn't create an account, you can ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { generateCode, sendVerificationEmail };