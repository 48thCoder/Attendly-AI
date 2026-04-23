const router = require('express').Router();
const { getToday, getWeeklyStats, getStudentAttendance, checkIn } = require('../controllers/attendanceController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/today', auth, requireRole('teacher'), getToday);
router.get('/weekly', auth, requireRole('teacher'), getWeeklyStats);
router.get('/student/:userId', auth, getStudentAttendance);
router.post('/check-in', auth, requireRole('teacher'), checkIn);

module.exports = router;
