const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { auth } = require('../middleware/auth');

const settingsRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/', settingsRateLimit, auth, getSettings);
router.put('/', settingsRateLimit, auth, updateSettings);

module.exports = router;
