const router = require('express').Router();
const { getRecords, exportCSV } = require('../controllers/recordController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', auth, requireRole('teacher'), getRecords);
router.get('/export', auth, requireRole('teacher'), exportCSV);

module.exports = router;
