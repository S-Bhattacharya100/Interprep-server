const joi = require("joi");

// Register validation
const registerSchema = joi.object({
    name: joi.string()
    .min(3)
    .max(30)
    .required(),

    email: joi.string()
    .email()
    .required(),

    password: joi.string()
    .min(6)
    .max(20)
    .required(),

    role: joi.string()
    .valid("admin", "user")
    .optional()
    .default("user")
});

// Login vadilation
const loginSchema = joi.object({
    email: joi.string()
    .email()
    .required(),

    password: joi.string()
    .required(),
});

// Refresh token validator
const refreshTokenSchema = joi.object({
    refreshToken: joi.string()
    .required()
});

// logout validator
const logoutSchema = joi.object({
    refreshToken: joi.string()
    .required()
});

module.exports = { 
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    logoutSchema
}