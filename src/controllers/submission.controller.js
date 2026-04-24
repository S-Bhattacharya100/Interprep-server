const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const ApiError = require("../utils/apiError");
const status = require("../constants/statusCodes");

const createSubmission = asyncHandler ( async (req, res) => {
    const { problemId, code, language } = req.body;

    const problem = await Problem.findById(problemId);

    if(!problem) {
        throw new ApiError(status.NOT_FOUND, "Problem not found");
    }

    const submission = new Submission({
        user: req.user.id,
        problem: problemId,
        code,
        language 
    });

    res.status(status.CREATED).json({
        success: true,
        data: submission
    });
});

module.exports = createSubmission;