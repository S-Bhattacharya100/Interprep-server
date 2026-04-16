const crypto = require("crypto");

// Generate email verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// Generate reset password token
const generateResetPasswordToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

module.exports = { generateVerificationToken, generateResetPasswordToken };