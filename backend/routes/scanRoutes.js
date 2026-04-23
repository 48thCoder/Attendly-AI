const router = require('express').Router();
const { recognize } = require('../controllers/scanController');
const { auth, requireRole } = require('../middleware/auth');

router.post('/recognize', auth, requireRole('teacher'), recognize);

module.exports = router;
