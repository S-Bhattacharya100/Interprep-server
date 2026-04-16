const nodemailer = require("nodemailer");

// Create transporter once and reuse it
const getTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER?.trim(),
            pass: process.env.EMAIL_PASS?.trim()
        }
    });
};

// Generic email sending function
const sendEmail = async (email, subject, html) => {
    const transporter = getTransporter();

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER?.trim(),
            to: email,
            subject,
            html
        });
        console.log("Email sent:", info.response);
        return info;
    } catch (error) {
        console.error("Email send error:", error.message);
        throw error;
    }
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

    const html = `
        <h2>Email Verification</h2>
        <p>Click below to verify your account:</p>
        <a href="${verificationUrl}">Verify Email</a>
    `;

    return sendEmail(email, "Verify your email", html);
};

// Send reset password email
const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/api/auth/reset-password?token=${token}`;

    const html = `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
    `;

    return sendEmail(email, "Reset your password", html);
};

module.exports = { 
    sendVerificationEmail, 
    sendResetPasswordEmail,
    sendEmail 
};