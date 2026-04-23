const Session = require("../models/Session");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const { Parser } = require("json2csv");

exports.getRecords = async (req, res, next) => {
  try {
    const { filter, from, to } = req.query;

    let startDate, endDate;
    const now = new Date();

    switch (filter) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = now;
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = now;
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        endDate = now;
        break;
      case "custom":
        if (!from || !to) {
          return res
            .status(400)
            .json({ message: 'Custom filter requires "from" and "to" dates.' });
        }
        startDate = new Date(from);
        endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        endDate = now;
    }

    const sessions = await Session.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("teacherId", "name")
      .sort({ date: -1 });

    const totalStudents = await User.countDocuments({ role: "student", status: "active" });

    const records = await Promise.all(sessions.map(async (session) => {
      const attendances = await Attendance.find({ sessionId: session._id }).populate("userId", "_id");
      const validAttendances = attendances.filter(a => a.userId != null);

      const uniquePresent = new Set();
      validAttendances.forEach((a) => {
        if (a.status === "present" || a.status === "late") {
          uniquePresent.add(a.userId._id.toString());
        }
      });
      const presentCount = uniquePresent.size;
      const absentCount = totalStudents - presentCount;

      return {
        id: session._id,
        date: session.date,
        class: session.className,
        teacher: session.teacherId?.name || "Unknown",
        present: presentCount,
        absent: absentCount,
        total: totalStudents,
        rate: session.rate || (totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0),
      };
    }));

    res.json(records);
  } catch (error) {
    next(error);
  }
};

exports.exportCSV = async (req, res, next) => {
  try {
    const { filter, from, to } = req.query;

    let startDate, endDate;
    const now = new Date();

    switch (filter) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = now;
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        endDate = now;
        break;
      case "custom":
        startDate = new Date(from);
        endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        endDate = now;
    }

    const sessions = await Session.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("teacherId", "name")
      .sort({ date: -1 });

    const totalStudents = await User.countDocuments({ role: "student", status: "active" });

    const data = await Promise.all(sessions.map(async (session) => {
      const attendances = await Attendance.find({ sessionId: session._id }).populate("userId", "_id");
      const validAttendances = attendances.filter(a => a.userId != null);

      const uniquePresent = new Set();
      validAttendances.forEach((a) => {
        if (a.status === "present" || a.status === "late") {
          uniquePresent.add(a.userId._id.toString());
        }
      });
      const presentCount = uniquePresent.size;
      const absentCount = totalStudents - presentCount;

      return {
        Date: session.date.toISOString().split("T")[0],
        Class: session.className,
        Teacher: session.teacherId?.name || "Unknown",
        "Total Students": totalStudents,
        Present: presentCount,
        Absent: absentCount,
        "Attendance Rate (%)": session.rate || (totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0),
      };
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.header(
      "Content-Disposition",
      `attachment; filename=attendance-records-${filter || "all"}.csv`,
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
