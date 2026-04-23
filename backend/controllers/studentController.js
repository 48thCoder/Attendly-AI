const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

exports.getAll = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student", status: "active" })
      .select("-password -faceDescriptor")
      .sort({ name: 1 });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const totalRecords = await Attendance.countDocuments({
          userId: student._id,
          timestamp: { $gte: startOfMonth },
        });

        const presentRecords = await Attendance.countDocuments({
          userId: student._id,
          timestamp: { $gte: startOfMonth },
          status: { $in: ["present", "late"] },
        });

        const attendancePct =
          totalRecords > 0
            ? Math.round((presentRecords / totalRecords) * 100)
            : 0;

        let statusLabel = "good";
        if (attendancePct < 60) statusLabel = "critical";
        else if (attendancePct < 75) statusLabel = "warning";

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          roll: student.roll,
          department: student.department,
          avatar: student.avatar,
          attendancePct,
          status: statusLabel,
          totalClasses: totalRecords,
          attended: presentRecords,
        };
      }),
    );

    res.json(studentsWithStats);
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, roll, email, department, faceDescriptor, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A student with this email already exists." });
    }

    if (roll) {
      const existingRoll = await User.findOne({
        roll: roll.trim(),
        role: "student",
      });
      if (existingRoll) {
        return res
          .status(409)
          .json({ message: "A student with this roll number already exists." });
      }
    }

    if (
      faceDescriptor &&
      Array.isArray(faceDescriptor) &&
      faceDescriptor.length > 0
    ) {
      const students = await User.find({
        role: "student",
        status: "active",
        faceDescriptor: { $exists: true, $ne: [] },
      }).select("name roll faceDescriptor");

      for (const st of students) {
        if (!st.faceDescriptor || st.faceDescriptor.length === 0) continue;

        const distance = euclideanDistance(faceDescriptor, st.faceDescriptor);
        if (distance < 0.2) {
          // 80% confidence threshold, means faces are very similar
          return res
            .status(409)
            .json({
              message: `Biometrics already registered to student ${st.name} (${st.roll}).`,
            });
        }
      }
    }

    const lastFour = roll ? roll.slice(-4) : Date.now().toString().slice(-4);
    const autoPassword = `AttendlyAI@${lastFour}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(autoPassword, salt);

    const student = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
      roll,
      department,
      faceDescriptor: faceDescriptor || [],
      avatar,
      mustChangePassword: true,
    });

    res.status(201).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        roll: student.roll,
        department: student.department,
        avatar: student.avatar,
      },
      temporaryPassword: autoPassword,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    if (student.role !== "student") {
      return res
        .status(400)
        .json({ message: "Can only delete student accounts." });
    }

    // Physically delete the student and their attendance records
    await Attendance.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Student and related records deleted.",
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id).select("-password");
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found." });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

function euclideanDistance(arr1, arr2) {
  if (arr1.length !== arr2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    const diff = arr1[i] - arr2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}
