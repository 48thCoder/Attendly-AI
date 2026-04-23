const User = require('../models/User');
const Settings = require('../models/Settings');
const Attendance = require('../models/Attendance');
const Session = require('../models/Session');

exports.recognize = async (req, res, next) => {
  try {
    const { faceDescriptor } = req.body;

    if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length === 0) {
      return res.status(400).json({ message: 'Face descriptor array is required.' });
    }

    const settings = await Settings.findOne({ userId: req.user.id });
    const threshold = settings?.recognitionThreshold || 80;

    const students = await User.find({
      role: 'student',
      status: 'active',
      faceDescriptor: { $exists: true, $ne: [] }
    }).select('name roll department avatar faceDescriptor');

    let bestMatch = null;
    let bestDistance = Infinity;

    for (const student of students) {
      if (!student.faceDescriptor || student.faceDescriptor.length === 0) continue;

      const distance = euclideanDistance(faceDescriptor, student.faceDescriptor);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = student;
      }
    }

    const confidence = Math.round(Math.max(0, (1 - bestDistance) * 100));
    const recognized = bestMatch && confidence >= threshold;

    let alreadyMarked = false;
    if (recognized) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Find the most recent active session for today
      let session = await Session.findOne({
        teacherId: req.user.id,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ createdAt: -1 });

      if (!session) {
        return res.status(400).json({ 
          message: 'No active session found. Please start a class/session before scanning.',
          recognized: true,
          student: {
            id: bestMatch._id,
            name: bestMatch.name,
            roll: bestMatch.roll,
            department: bestMatch.department,
            avatar: bestMatch.avatar
          }
        });
      }

      const existingRecord = await Attendance.findOne({
        userId: bestMatch._id,
        sessionId: session._id,
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      });

      if (!existingRecord) {
        await Attendance.create({
          userId: bestMatch._id,
          sessionId: session._id,
          confidence,
          status: 'present',
          markedBy: 'ai'
        });

        // Update session counts
        session.presentCount += 1;
        session.absentCount = Math.max(0, session.totalStudents - session.presentCount);
        await session.save();

        const io = req.app.get('io');
        if (io) {
          io.emit('new_notification', {
            id: Date.now().toString(),
            title: "Attendance Marked",
            desc: `Recognized ${bestMatch.name} (${bestMatch.roll}) with ${confidence}% confidence`,
            time: "Just now",
            unread: true,
            type: "success",
            recipientRole: 'teacher'
          });
          
          io.emit('new_notification', {
            id: Date.now().toString() + '_s',
            title: "Attendance Marked",
            desc: `You were marked Present`,
            time: "Just now",
            unread: true,
            type: "success",
            recipientRole: 'student',
            recipientId: bestMatch._id.toString()
          });
        }
      } else {
        alreadyMarked = true;
      }
    }

    res.json({
      recognized,
      confidence,
      alreadyMarked,
      time: new Date().toISOString(),
      ...(recognized && {
        student: {
          id: bestMatch._id,
          name: bestMatch.name,
          roll: bestMatch.roll,
          department: bestMatch.department,
          avatar: bestMatch.avatar
        }
      })
    });
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
