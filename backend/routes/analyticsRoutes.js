const router = require('express').Router();
const { getReport, predict } = require('../controllers/analyticsController');
const { auth } = require('../middleware/auth');

router.get('/report', auth, getReport);
router.get('/predict/:userId', auth, predict);

module.exports = router;
