const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    logoutSchema
} = require("../utils/validators/auth.validator");

// API routs
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.logIn);

router.post("/refresh", validate(refreshTokenSchema), authController.refreshTokenHandler);
router.post("/logout", validate(logoutSchema), authController.logout);

router.get("/verify-email", authController.verifyEmail);

module.exports = router;