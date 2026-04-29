const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const {
    registerSchema,
    resendVerificationSchema,
    loginSchema,
    refreshTokenSchema,
    logoutSchema
} = require("../utils/validators/auth.validator");

// API routs
router.post("/register", validate(registerSchema), authController.register);
router.post("/resend-verification", validate(resendVerificationSchema), authController.resendVerification);
router.post("/login", validate(loginSchema), authController.logIn);

router.post("/refresh", validate(refreshTokenSchema), authController.refreshTokenHandler);
router.post("/logout", validate(logoutSchema), authController.logout);

router.get("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;