const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ["java", "javascript", "python", "cpp"],
        type: true
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Wrong Answer",
            "Runtime Error",
            "Time Limit Exceeded"
        ],
        default: "Pending"
    },
    output: String,
    error: String,
    executionTime: Number
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);