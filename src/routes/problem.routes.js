const express = require("express");
const router = express.Router();

const controller = require("../controllers/problem.controller");
const authRoles = require("../middleware/role.middleware");
const authHeader = require("../middleware/auth.middleware");

router.post("/", authHeader, authRoles("Admin"), controller.createProblem);
router.get("/", authHeader, controller.getProblems);

module.exports = router;