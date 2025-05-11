const express = require("express");
const dotenv = require("dotenv").config();
const studentRoutes = require("./routes/student.routes");
const dbConnection = require("./config/dbConnect");
const { MulterError } = require("multer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const auth = require("./middleware/auth");
const userRoutes = require("./routes/user.routes");
const helmet=require("helmet")

const app = express();

// api security
const limiter = rateLimit({
  windowMs: 1000 * 60, // 1000 * 60 *15 - 15 mint
  max: 5, //100,
  message: "Too many request from this IP, Please try again later",
});
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(limiter);
app.use(helmet())

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dbConnection();
app.use("/api/users", userRoutes);
app.use(auth);
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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(process.env.port, () => {
  console.log(`Server is running on http://localhost:${process.env.port}`);
});
