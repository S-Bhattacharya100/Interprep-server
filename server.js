const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const adminRoutes = require("./src/routes/admin.routes");
const userRoutes = require("./src/routes/user.routes");
require("dotenv").config();
const errorHandler = require("./src/middleware/error.middleware");

const app = express();

// Initialization of database
connectDB();

app.use(cors({
    origin: "http://localhost:5173"
}));

// Parsing json data
app.use(express.json());

// calling api middleware
app.use("/api/auth", authRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/auth", userRoutes);

// Calling error handling middleware
app.use(errorHandler);

// Initialization of server
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running in ${port} port`);
});