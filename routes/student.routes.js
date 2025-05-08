const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/student.model");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only IMages are allowed"), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

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
router.post("/", upload.single("profilePic"), async (req, res) => {
  try {
    // const newStudent = await Student.create(req.body);
    const student = new Student(req.body);
    if (req.file) {
      student.profilePic = req.file.filename;
    }
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update a Student
router.put("/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const existingStudents = await Student.findById(req.params.id);
    if (!existingStudents) {
      if (req.file.filename) {
        const filePath = path.join("./uploads", req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.log("Failed to Delete Image ", err);
        });
      }
      return res.status(404).json({ message: "student not found" });
    }

    // remove the image
    if (req.file) {
      if (existingStudents.profilePic) {
        const oldImagePath = path.join(
          "./uploads",
          existingStudents.profilePic
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log("Failed to old Delete Image", err);
        });
      }
      req.body.profilePic = req.file.filename;
    }
    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
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
router.delete("/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const deleteStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deleteStudent)
      return res.status(404).json({ message: "student not found" });
    if (deleteStudent.profilePic) {
      const filePath = path.join("./uploads", deleteStudent.profilePic);
      fs.unlink(filePath, (err) => {
        if (err) console.log("Failed to Delete", err);
      });
    }
    res.json("Student Deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
