const express = require("express");
const Student = require("../models/student.model");

const router = express.Router();

// get All Student
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a single Student
router.get("/:id", async (req, res) => {
  try {
    const students = await Student.findById(req.params.id);
    if (!students)
      return res.status(404).json({ message: "student not found" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new Student
router.post("/", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update a Student
router.put("/:id", async (req, res) => {
  try {
    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,req.body,
      {
        new: true,
      }
    );
    if (!updateStudent)
      return res.status(404).json({ message: "student not found" });
    res.json(updateStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a Student
router.delete("/:id", async (req, res) => {
  try {
    const deleteStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deleteStudent)
      return res.status(404).json({ message: "student not found" });
    res.json("Student Deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
