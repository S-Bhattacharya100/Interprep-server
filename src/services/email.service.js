const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
    // Create transporter on-demand with latest env variables
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER?.trim(),
            pass: process.env.EMAIL_PASS?.trim()
        }
    });

    const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

    console.log("Sending email from:", process.env.EMAIL_USER?.trim());
    console.log("Verification URL:", verificationUrl);

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER?.trim(),
            to: email,
            subject: "Verify your email",
            html: `
                <h2>Email Verification</h2>
                <p>Click below to verify your account:</p>
                <a href="${verificationUrl}">Verify Email</a>
            `
        });
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Email send error:", error.message);
        throw error;
    }
};

module.exports = { sendVerificationEmail };