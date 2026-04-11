const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.get("/user", authMiddleware, authorizeRoles("user"), (req, res) => {

    res.json({
        message: "User access granted",
        userId: req.user.id
    });
});

module.exports = router;