const express = require("express");
const dotenv = require("dotenv").config();
const studentRoutes = require("./routes/student.routes");
const dbConnection = require("./config/dbConnect");
const { MulterError } = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

dbConnection();
app.use("/api/students", studentRoutes);

app.use((error, req, res, next) => {
  if (error instanceof MulterError) {
    return res.status(400).send(`Image Error: ${error.message}:${error.code}`);
  } else if (error) {
    return res.status(500).send(`Something went wrong ${error.message}`);
  }
  next();
});

// // Sample route
// app.get("/", (req, res) => {
//   res.send("Welcome to the Express.js API!");
// });

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(process.env.port, () => {
  console.log(`Server is running on http://localhost:${process.env.port}`);
});
