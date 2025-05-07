const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
    trim: true,
  },
  profilePic: {
    type: String,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
