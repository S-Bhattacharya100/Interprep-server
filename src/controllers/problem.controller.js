const asyncHandler = require("../utils/asyncHandler");
const Problem = require("../models/problem.model");
const status = require("../constants/statusCodes");

const createProblem = asyncHandler ( async (req, res) => {
    const problem = new Problem({
        ...req.body,
        createdBy: req.user.id
    });

    await problem.save();

    res.status(status.CREATED).json({
        success: true,
        data: problem
    });
});

const getProblems = asyncHandler ( async (req, res) => {

    const { difficulty, category, page = 1, limit = 10 } = req.query;

    const query = {};
    if(difficulty) query.difficulty = difficulty;
    if(category) query.category = category; 

    const problems = await Problem.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.status(status.SUCCESS).json({
        success: true,
        count: problems.length,
        data: problems
    });
});

module.exports = {
    createProblem,
    getProblems
}