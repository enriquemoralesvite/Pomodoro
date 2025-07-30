const express = require('express');
const router = express.Router();
const {
  registerSession,
  getStats,
  getTimerConfig
} = require('../controllers/timerController');

router.post('/', registerSession);      // POST /api/timer
router.get('/stats', getStats);         // GET /api/timer/stats
router.get('/config', getTimerConfig);  // GET /api/timer/config

module.exports = router;
