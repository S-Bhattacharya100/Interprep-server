const jwt = require("jsonwebtoken");

// Generating the access token using JWT
const generateAccessToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
}

module.exports = { 
    generateAccessToken ,
    generateRefreshToken
};