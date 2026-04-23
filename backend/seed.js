const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Attendance = require("./models/Attendance");
const Session = require("./models/Session");
const Settings = require("./models/Settings");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await User.deleteMany({});
    await Attendance.deleteMany({});
    await Session.deleteMany({});
    await Settings.deleteMany({});
    console.log("Cleared existing data.");

    const salt = await bcrypt.genSalt(10);
    const teacherPassword = await bcrypt.hash("password123", salt);
    const studentPassword = await bcrypt.hash("student123", salt);

    const teacher = await User.create({
      name: "Dr. Sarah Mitchell",
      email: "teacher@attendly.ai",
      password: teacherPassword,
      role: "teacher",
      department: "CSE Core",
      avatar: "",
    });
    console.log(`Created teacher: ${teacher.email}`);

    const studentData = [
      {
        name: "Arjun Sharma",
        roll: "CS-2024-001",
        email: "arjun@student.edu",
        department: "CSE Core",
      },
      {
        name: "Priya Patel",
        roll: "CS-2024-002",
        email: "priya@student.edu",
        department: "CSE Core",
      },
      {
        name: "Rahul Kumar",
        roll: "CS-2024-003",
        email: "rahul@student.edu",
        department: "CSE Core",
      },
      {
        name: "Ananya Singh",
        roll: "CS-2024-004",
        email: "ananya@student.edu",
        department: "CSE Core",
      },
      {
        name: "Vikram Reddy",
        roll: "EC-2024-001",
        email: "vikram@student.edu",
        department: "CSE (IOT)",
      },
      {
        name: "Meera Nair",
        roll: "EC-2024-002",
        email: "meera@student.edu",
        department: "CSE (IOT)",
      },
      {
        name: "Aditya Joshi",
        roll: "ME-2024-001",
        email: "aditya@student.edu",
        department: "AIML",
      },
      {
        name: "Neha Gupta",
        roll: "ME-2024-002",
        email: "neha@student.edu",
        department: "AIML",
      },
      {
        name: "Karthik Menon",
        roll: "CS-2024-005",
        email: "karthik@student.edu",
        department: "CSE Core",
      },
      {
        name: "Sneha Iyer",
        roll: "CS-2024-006",
        email: "sneha@student.edu",
        department: "CSE Core",
      },
    ];

    const students = await User.insertMany(
      studentData.map((s) => ({
        ...s,
        password: studentPassword,
        role: "student",
        faceDescriptor: [],
        status: "active",
      })),
    );
    console.log(`Created ${students.length} students.`);

    await Settings.create({
      userId: teacher._id,
      recognitionThreshold: 80,
      autoMarkTime: "09:30",
      cameraResolution: "1080p",
      notifications: true,
      emailDigest: true,
      theme: "dark",
    });

    const classNames = [
      "CS-301 Data Structures",
      "CS-302 Algorithms",
      "CS-303 Operating Systems",
      "CS-304 Database Systems",
    ];

    const sessions = [];
    const attendanceRecords = [];

    for (let dayOffset = 20; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);

      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const className =
        classNames[Math.floor(Math.random() * classNames.length)];
      const totalStudents = students.length;

      let presentCount = 0;
      const sessionId = new mongoose.Types.ObjectId();

      for (const student of students) {
        const rand = Math.random();
        let status;

        if (rand < 0.7) status = "present";
        else if (rand < 0.85) status = "late";
        else status = "absent";

        if (status !== "absent") presentCount++;

        const sessionDate = new Date(date);
        sessionDate.setHours(9, Math.floor(Math.random() * 30), 0, 0);

        attendanceRecords.push({
          userId: student._id,
          sessionId,
          timestamp: sessionDate,
          status,
          confidence:
            status !== "absent" ? Math.floor(Math.random() * 15) + 85 : null,
          markedBy: "ai",
        });
      }

      sessions.push({
        _id: sessionId,
        className,
        teacherId: teacher._id,
        date,
        totalStudents,
        presentCount,
        absentCount: totalStudents - presentCount,
        rate: Math.round((presentCount / totalStudents) * 100),
      });
    }

    await Session.insertMany(sessions);
    await Attendance.insertMany(attendanceRecords);

    console.log(
      `Created ${sessions.length} sessions with ${attendanceRecords.length} attendance records.`,
    );
    console.log("\nSeed complete! Login credentials:");
    console.log("  Teacher: teacher@attendly.ai / password123");
    console.log("  Student: arjun@student.edu / student123");
    console.log("  (All student passwords: student123)");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
