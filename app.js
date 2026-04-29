require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const problemRouts = require("./src/routes/problem.routes");
const submissionRoute = require("./src/routes/submission.routes");
const errorHandler = require("./src/middleware/error.middleware");

const app = express();

// Initialization of database
connectDB();

app.use(cors({
    origin: "http://localhost:5173"
}));

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// auth route
app.use("/api/auth", authRoutes);

// Problem route
app.use("/api/problem", problemRouts);

// Submission route
app.use("/api/submissions", submissionRoute);

// Calling error handling middleware
app.use(errorHandler);

module.exports = app;