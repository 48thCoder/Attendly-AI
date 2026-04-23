const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Session = require("../models/Session");

exports.getToday = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalStudents = await User.countDocuments({
      role: "student",
      status: "active",
    });

    const todayRecords = await Attendance.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    }).populate("userId", "name roll department avatar");

    const validRecords = todayRecords.filter((record) => record.userId != null);

    const uniquePresent = new Set();
    validRecords.forEach((record) => {
      if (
        (record.status === "present" || record.status === "late") &&
        record.userId
      ) {
        uniquePresent.add(
          record.userId._id
            ? record.userId._id.toString()
            : record.userId.toString(),
        );
      }
    });

    const presentCount = uniquePresent.size;
    const absentCount = totalStudents - presentCount;

    const confidenceScores = validRecords
      .filter((r) => r.confidence != null)
      .map((r) => r.confidence);
    const avgConfidence =
      confidenceScores.length > 0
        ? Math.round(
            confidenceScores.reduce((a, b) => a + b, 0) /
              confidenceScores.length,
          )
        : 0;

    const recentScans = validRecords
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map((record) => ({
        id: record._id,
        name: record.userId?.name || "Unknown",
        roll: record.userId?.roll || "",
        department: record.userId?.department || "",
        avatar: record.userId?.avatar || "",
        time: record.timestamp,
        confidence: record.confidence,
        status: record.status,
      }));

    res.json({
      present: presentCount,
      absent: absentCount,
      total: totalStudents,
      avgConfidence,
      recent: recentScans,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWeeklyStats = async (req, res, next) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);

    const totalStudents = await User.countDocuments({
      role: "student",
      status: "active",
    });

    const weekRecords = await Attendance.find({
      timestamp: { $gte: monday, $lte: friday },
    }).populate("userId", "name");

    // Filter out records where user no longer exists
    const validWeekRecords = weekRecords.filter(r => r.userId != null);

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const weeklyStats = dayNames.map((name, index) => {
      const dayStart = new Date(monday);
      dayStart.setDate(monday.getDate() + index);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayRecords = validWeekRecords.filter(
        (r) => r.timestamp >= dayStart && r.timestamp <= dayEnd,
      );

      const uniquePresent = new Set();
      dayRecords.forEach((r) => {
        if (r.status === "present" || r.status === "late") {
          uniquePresent.add(
            r.userId._id ? r.userId._id.toString() : r.userId.toString()
          );
        }
      });

      const present = uniquePresent.size;

      return {
        name,
        present,
        absent: dayStart <= today ? Math.max(0, totalStudents - present) : 0,
      };
    });

    res.json(weeklyStats);
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    const userId = req.params.userId === "me" ? req.user.id : req.params.userId;

    let records = await Attendance.find({ userId })
      .populate("sessionId", "className")
      .sort({ timestamp: -1 });



    const totalRecords = records.length;
    const presentRecords = records.filter(
      (r) => r.status === "present" || r.status === "late",
    ).length;
    const overallPct =
      totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

    const subjectMap = {};
    records.forEach((record) => {
      const subject = record.sessionId?.className || "General";
      if (!subjectMap[subject]) {
        subjectMap[subject] = { total: 0, present: 0 };
      }
      subjectMap[subject].total++;
      if (record.status === "present" || record.status === "late") {
        subjectMap[subject].present++;
      }
    });

    const subjects = Object.entries(subjectMap).map(([name, data]) => ({
      name,
      percentage: Math.round((data.present / data.total) * 100),
      present: data.present,
      total: data.total,
    }));

    const calendar = {};
    records.forEach((record) => {
      const dateKey = record.timestamp.toISOString().split("T")[0];
      if (!calendar[dateKey]) {
        calendar[dateKey] =
          record.status === "present" || record.status === "late"
            ? "present"
            : "absent";
      }
    });

    res.json({
      overallPct,
      subjects,
      calendar,
      totalClasses: totalRecords,
      attendedClasses: presentRecords,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const { userId, sessionId, confidence } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let targetSessionId = sessionId;
    if (!targetSessionId) {
      const defaultClassName = req.user.department ? `${req.user.department} - Daily Check-in` : "General Daily Check-in";

      let session = await Session.findOne({
        teacherId: req.user.id,
        className: defaultClassName,
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      if (!session) {
        const totalStudents = await User.countDocuments({
          role: "student",
          status: "active",
        });
        session = await Session.create({
          className: defaultClassName,
          teacherId: req.user.id,
          date: startOfDay,
          totalStudents,
        });
      }
      targetSessionId = session._id;
    }

    const existingRecord = await Attendance.findOne({
      userId,
      sessionId: targetSessionId,
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingRecord) {
      return res.status(409).json({
        message: "Already checked in for this session today.",
        record: existingRecord,
      });
    }

    const record = await Attendance.create({
      userId,
      sessionId: targetSessionId,
      confidence,
      status: "present",
      markedBy: "ai",
    });

    await Session.findByIdAndUpdate(
      targetSessionId,
      {
        $inc: { presentCount: 1 },
      },
      { new: true },
    ).then(async (s) => {
      if (s) {
        s.absentCount = Math.max(0, s.totalStudents - s.presentCount);
        await s.save();
      }
    });

    res.status(201).json({ success: true, record });
  } catch (error) {
    next(error);
  }
};
