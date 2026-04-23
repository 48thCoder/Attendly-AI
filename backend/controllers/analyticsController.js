const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { analyzeAttendance } = require('../utils/gemini');

exports.getReport = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const records = await Attendance.find({
      timestamp: { $gte: thirtyDaysAgo }
    })
    .populate('userId', 'name roll department')
    .populate('sessionId', 'className');

    // Filter out General AI Recognition records
    const filteredRecords = records.filter(record => record.sessionId?.className !== 'General AI Recognition');

    const students = await User.find({ role: 'student', status: 'active' })
      .select('name roll department');

    const studentStats = {};
    students.forEach(s => {
      studentStats[s._id.toString()] = {
        name: s.name,
        roll: s.roll,
        department: s.department,
        total: 0,
        present: 0,
        absent: 0,
        trend: []
      };
    });

    filteredRecords.forEach(record => {
      const uid = record.userId?._id?.toString();
      if (uid && studentStats[uid]) {
        studentStats[uid].total++;
        if (record.status === 'present' || record.status === 'late') {
          studentStats[uid].present++;
        } else {
          studentStats[uid].absent++;
        }
        studentStats[uid].trend.push({
          date: record.timestamp.toISOString().split('T')[0],
          status: record.status
        });
      }
    });

    const summaryData = Object.values(studentStats).map(s => ({
      name: s.name,
      roll: s.roll,
      department: s.department,
      attendanceRate: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
      totalClasses: s.total,
      present: s.present,
      absent: s.absent
    }));

    const atRiskStudents = summaryData
      .filter(s => s.attendanceRate < 75)
      .sort((a, b) => a.attendanceRate - b.attendanceRate);

    let aiInsights = null;

    try {
      const prompt = `Analyze these attendance statistics for a college/university and provide:
1. Students showing a downward attendance trend
2. Days or patterns with highest absenteeism
3. Students at risk of falling below 75% attendance
4. Actionable recommendations for improving attendance

Return your response as a JSON object with these keys:
- trends: array of trend observations (strings)
- recommendations: array of actionable recommendations (strings)
- riskAnalysis: brief analysis of at-risk students (string)
- overallHealth: "good", "moderate", or "critical" (string)

Student Data:
${JSON.stringify(summaryData, null, 2)}`;

      aiInsights = await analyzeAttendance(prompt);
    } catch (aiError) {
      console.error('Gemini API error (non-fatal):', aiError.message);
      aiInsights = {
        trends: ['AI analysis temporarily unavailable.'],
        recommendations: ['Please check your Gemini API key configuration.'],
        riskAnalysis: 'Unable to generate AI analysis at this time.',
        overallHealth: 'unknown'
      };
    }

    res.json({
      insights: aiInsights,
      atRiskStudents,
      summary: {
        totalStudents: students.length,
        averageAttendance: summaryData.length > 0
          ? Math.round(summaryData.reduce((a, b) => a + b.attendanceRate, 0) / summaryData.length)
          : 0,
        atRiskCount: atRiskStudents.length
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.predict = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const student = await User.findById(userId).select('name roll department');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    let records = await Attendance.find({ userId })
      .populate('sessionId', 'className')
      .sort({ timestamp: -1 });

    // Filter out General AI Recognition records
    records = records.filter(record => record.sessionId?.className !== 'General AI Recognition');
    
    // Take last 60 for trajectory analysis
    const trajectoryRecords = records.slice(0, 60);

    const totalRecords = trajectoryRecords.length;
    const presentCount = trajectoryRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const currentPct = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    let prediction = null;

    try {
      const prompt = `Given a student's attendance record, predict their future attendance trajectory.

Student: ${student.name} (Roll: ${student.roll}, Dept: ${student.department})
Current attendance: ${currentPct}% over ${totalRecords} classes
Recent pattern (last 10): ${trajectoryRecords.slice(0, 10).map(r => r.status).join(', ')}

Return a JSON object with:
- prediction: brief prediction of future attendance (string)
- riskLevel: "low", "medium", or "high" (string)
- suggestion: one actionable suggestion (string)
- projectedPct: estimated attendance % in 30 days (number)`;

      prediction = await analyzeAttendance(prompt);
    } catch (aiError) {
      console.error('Gemini prediction error (non-fatal):', aiError.message);
      prediction = {
        prediction: 'AI prediction temporarily unavailable.',
        riskLevel: currentPct >= 75 ? 'low' : currentPct >= 60 ? 'medium' : 'high',
        suggestion: 'Monitor attendance patterns manually.',
        projectedPct: currentPct
      };
    }

    res.json({
      student: { name: student.name, roll: student.roll, department: student.department },
      currentPct,
      totalClasses: totalRecords,
      ...prediction
    });
  } catch (error) {
    next(error);
  }
};
