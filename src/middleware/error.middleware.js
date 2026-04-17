const logger = require("../utils/logger");

// Global error handler middleware
const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    // Log error using Winston
    logger.error({
        message: err.message,
        statusCode,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
        user: req.user ? req.user.id : null
    });

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
}



module.exports = errorHandler;