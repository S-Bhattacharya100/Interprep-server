const express = require("express");
const router = express.Router();

const controller = require("../controllers/submission.controller");
const authHeader = require("../middleware/auth.middleware");

router.post("/", authHeader, controller.createSubmission);

module.exports = router;