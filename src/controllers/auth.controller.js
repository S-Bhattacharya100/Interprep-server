const User = require("../models/user.model");
const tokenService = require("../services/token.service");
const status = require("../constants/statusCodes");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

// Register
const register = asyncHandler(async (req, res) => {

    const { name, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(status.BAD_REQUEST, "User already exists");
    }

    // Save the user
    const user = new User({
        name,
        email,
        password,
        role
    });

    await user.save(); // Triggers pre-save hashing internally

    // Generate access token
    const accessToken = tokenService.generateAccessToken(user);
    // Generate refresh token
    const refreshToken = tokenService.generateRefreshToken(user._id);

    // Add refresh token
    await User.findByIdAndUpdate(user._id, {
        refreshToken
    });

    // Send registerd and logged in response
    return res.status(status.CREATED).json({
        message: "User registerd successfully",
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

// Log in
const logIn = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Check for existing user
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid credentials");
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


const refreshTokenHandler = asyncHandler(async (req, res) => {

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

const logout = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(status.UNAUTHORIZED, "Refresh token not found");
    }

    const user = await User.findById( req.user.id );

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
    logIn,
    refreshTokenHandler,
    logout
};
