const router = require('express').Router();
const { login, register, getMe, changePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, getMe);
router.post('/change-password', auth, changePassword);

module.exports = router;
