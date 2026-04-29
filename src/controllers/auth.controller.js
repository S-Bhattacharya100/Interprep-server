const User = require("../models/user.model");
const tokenService = require("../services/token.service");
const status = require("../constants/statusCodes");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const crypto = require("crypto");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../services/email.service");
const { generateVerificationToken, generateResetPasswordToken } = require("../utils/token.utils");

// Register
const register = asyncHandler ( async (req, res) => {

    const { name, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(status.BAD_REQUEST, "User already exists");
    }

    const verificationToken = generateVerificationToken();

    // Save the user
    const user = new User({
        name,
        email,
        password,
        role,
        verificationToken,
        verificationTokenExpiry: Date.now() + 10 * 60 * 1000 // 10 min
    });

    await user.save(); // Triggers pre-save hashing internally

    await sendVerificationEmail(email, verificationToken);

    // Send registration and login response
    return res.status(status.CREATED).json({
        message: "User registered successfully. Please verify your email.",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });

});

// Re-send verification email
const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(status.NOT_FOUND, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(status.BAD_REQUEST, "User already verified");
    }

    const token = generateVerificationToken();

    user.verificationToken = token;
    user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendVerificationEmail(email, token);

    res.json({
        message: "Verification email resent"
    });
});

// Verify email
const verifyEmail = asyncHandler( async (req, res) => {
    const { token } = req.query;

    if(!token) {
        throw new ApiError(status.BAD_REQUEST, "Verification token is required");
    }

    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() }
    });

    if(!user) {
        throw new ApiError(status.UNAUTHORIZED, "Expired or invalid verification token");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    // Generate tokens for auto-login
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // Send verification success with auto-login tokens
    return res.status(status.SUCCESS).json({
        message: "Email verified successfully. Logged in automatically.",
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Forgot password
const forgotPassword = asyncHandler ( async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if(!user) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid credential");
    }

    if(user.refreshToken) {
        throw new ApiError(status.BAD_REQUEST, "User already logged in");
    }

    const token = generateResetPasswordToken();

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    sendResetPasswordEmail(email, token);
    res.json({
        message: "Reset link sent to email"
    });
});

// Reset password
const resetPassword = asyncHandler ( async (req, res) => {
    const { token, newPassword } = req.body;

    if(!token || !newPassword) {
        throw new ApiError(status.BAD_REQUEST, "Token and new password required");
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if(!user) {
        throw new ApiError(status.BAD_REQUEST, "Invalid or expired token");
    }

    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    user.password = newPassword;

    await user.save();

    res.json({
        message: "Password reset successful"
    });
});

// Log in
const logIn = asyncHandler ( async (req, res) => {

    const { email, password } = req.body;

    // Check for existing user
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid credentials");
    }

    if(!user.isVerified) {
        throw new ApiError(status.FORBIDDEN, "Please verify your email first");
    }

    // Check for valid password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid credentials");
    }

    // Generate access token
    const accessToken = tokenService.generateAccessToken(user);
    // Generate refresh token
    const refreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    // Send logged in response
    return res.status(status.SUCCESS).json({
        message: "Log in successfull",
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Refresh token handler
const refreshTokenHandler = asyncHandler ( async (req, res) => {

    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(status.UNAUTHORIZED, "Refresh token not found");
    }

    // Verify token
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    const accessToken = tokenService.generateAccessToken(user);

    return res.json({
        newAccessToken: accessToken
    });
});

const logout = asyncHandler( async (req, res) => {

    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(status.UNAUTHORIZED, "Refresh token not found");
    }

    const user = await User.findOne({ refreshToken });

    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    user.refreshToken = null;
    await user.save();

    res.json({
        message: "Logged out successfully"
    });
});

module.exports = {
    register,
    resendVerification,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logIn,
    refreshTokenHandler,
    logout
};
