const express = require("express");
const dotenv = require("dotenv").config();
const studentRoutes = require("./routes/student.routes");
const dbConnection = require("./config/dbConnect");

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dbConnection();
app.use("/api/students", studentRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Express.js API!");
});

// Start the server
app.listen(process.env.port, () => {
  console.log(`Server is running on http://localhost:${process.env.port}`);
});
