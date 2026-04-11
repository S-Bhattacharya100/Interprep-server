const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
    
    res.json({
        "message": "Admin access granted",
        "userId": req.user.id
    });
});

module.exports = router;
