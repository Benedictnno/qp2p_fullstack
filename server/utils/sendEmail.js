import dotenv from "dotenv";
dotenv.config();
import { createTransport } from "nodemailer";
import { Resend } from "resend";

// Create a transporter
const transporter = createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with Mailtrap SMTP configuration:", error);
  } else {
    console.log("Mailtrap SMTP configuration is ready to use.");
  }
});

async function sendVerificationEmail2(to, token) {
  // const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;
  const verificationLink = `http://localhost:5173/verify/${token}`;

  const mailOptions = {
    from: '"Your App Name" <quicktrade@gmail.com>',
    to, // Receiver's email
    subject: "Verify Your Email",
    html: `
      <h1>Welcome to QP2P</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

async function sendVerificationEmail(to, token) {
  const resend = new Resend(process.env.EMAIL_API_KEY);
  const verificationLink = `https://qp2p.onrender.com//verify/${token}`;
 
  // Convert 'to' to a proper string format
  to = Array.isArray(to)
    ? to.join(",")
    : typeof to === "object" && to.email
    ? to.email.toString()
    : String(to);

 
  await resend.emails.send({
    from: "QP2p@support.dev",
    to: to, // Now safely converted to a string
    subject: "Qp2p Email Verification",
    html: `
      <h1>Welcome to QP2P</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
}


export default sendVerificationEmail;
