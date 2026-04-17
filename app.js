require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const adminRoutes = require("./src/routes/admin.routes");
const userRoutes = require("./src/routes/user.routes");
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

// calling api middleware
app.use("/api/auth", authRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/auth", userRoutes);

// Calling error handling middleware
app.use(errorHandler);

module.exports = app;