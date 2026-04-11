const status = require("../constants/statusCodes");
const ApiError = require("../utils/apiError");

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Check roles config
        if (allowedRoles.length === 0) {
            return next(
                new ApiError(status.INTERNAL_SERVER_ERROR, "No roles specified for authorization")
            );
        }

        // Check if the user exists (set by auth middleware)
        if(!req.user) {
            return next(
                new ApiError(status.UNAUTHORIZED, "Unauthorized access")
            );
        }

        // Check role exists
        if (!req.user.role) {
            return next(
                new ApiError(status.UNAUTHORIZED, "User role not found")
            );
        }

        // Check if the user's role is allowed
        if(!allowedRoles.includes(req.user.role)) {
            return next(
                new ApiError(status.FORBIDDEN, `Role '${req.user.role}' is not allowed`)
            );
        }

        next();
    }
}

module.exports = authorizeRoles;