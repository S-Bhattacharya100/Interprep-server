const ApiError = require("../utils/apiError");
const status = require("../constants/statusCodes");

// Reusable Validation Middleware
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false // Show all errors
    });

    if(error) {
        const message = error.details.map(err => err.message).join(", ");
        return next(new ApiError(status.BAD_REQUEST, message));
    }

    next();
};

module.exports = validate;