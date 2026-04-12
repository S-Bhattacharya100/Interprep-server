const jwt = require("jsonwebtoken");
const status = require("../constants/statusCodes");
const ApiError = require("../utils/apiError");

// Authentication middleware for protected routs
const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // check if header exists
    if (!authHeader) {
        return next(
            new ApiError(status.UNAUTHORIZED, "No token provided")
        );
    }

    // Check token format
    if (!authHeader.startsWith("Bearer ")) {
        return next(
            new ApiError(status.UNAUTHORIZED, "Invalid token format")
        );
    }

    try {
        // Accessing the token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        return next(
            new ApiError(status.UNAUTHORIZED, "Invalid or expired token")
        );
    }

}

module.exports = authMiddleware;