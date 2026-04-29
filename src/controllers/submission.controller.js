const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const runner = require("../services/runner.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const status = require("../constants/statusCodes");

const createSubmission = asyncHandler(async (req, res) => {
    const { problem: problemId, code, language } = req.body;

    if (!problemId) {
        throw new ApiError(status.BAD_REQUEST, "problem is required");
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    // Create submission (pending)
    let submission = await Submission.create({
        user: req.user.id,
        problem: problemId,
        code,
        language,
        status: "Pending"
    });

    // Run evaluation
    const result = await runner.runCode({
        testCases: problem.testCases,
        code,
        language
    });

    // Save the result
    submission.status = result.status;
    submission.output = result.output;
    submission.error = result.error || null;

    await submission.save();

    res.status(status.CREATED).json({
        success: true,
        data: submission
    });
});

module.exports = { createSubmission };