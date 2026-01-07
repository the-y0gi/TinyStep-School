import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

// 📤 School notification email
export const sendNotificationEmail = async ({ to, title, message, type = "General" }) => {
  const formattedDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const mailOptions = {
    from: `"Preschool Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: `📢 ${type} - ${title}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">${title}</h2>

        <p>Dear Parent,</p>

        <p>${message}</p>

        <hr style="margin: 30px 0;"/>

        <p><strong>🗓️ Sent On:</strong> ${formattedDate}</p>
        <p style="margin-top: 30px;">Warm regards,<br/><strong>Preschool Admin Team</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};


// 📤 OTP Email Sender
export const sendOtpEmail = async ({ to, otp }) => {
  const formattedDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const mailOptions = {
    from: `"Preschool Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: `🔐 OTP for Preschool Signup`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Your OTP for Signup</h2>

        <p>Dear User,</p>

        <p>Your One-Time Password (OTP) is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #16a34a;">${otp}</p>

        <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>

        <hr style="margin: 30px 0;" />
        <p><strong>🕒 Sent On:</strong> ${formattedDate}</p>
        <p style="margin-top: 30px;">Regards,<br/><strong>Preschool Admin Team</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// 📤 Forgot Password OTP Email Sender
export const sendForgotPasswordOtpEmail = async ({ to, otp }) => {
  const formattedDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const mailOptions = {
    from: `"Preschool Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: `🔐 OTP to Reset Your Password`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>

        <p>Dear User,</p>

        <p>We received a request to reset your password. Use the OTP below to proceed:</p>
        <p style="font-size: 24px; font-weight: bold; color: #f59e0b;">${otp}</p>

        <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request a password reset, please ignore this email.</p>

        <hr style="margin: 30px 0;" />
        <p><strong>🕒 Sent On:</strong> ${formattedDate}</p>
        <p style="margin-top: 30px;">Regards,<br/><strong>Preschool Admin Team</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
