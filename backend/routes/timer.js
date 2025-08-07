const express = require('express');
const router = express.Router();
const {
  registerSession,
  getStats,
  getTimerConfig,
  getAggregatedStats // Se importa la nueva función
} = require('../controllers/timerController');
const authMiddleware = require('../middlewares/authMiddleware'); // Se importa el middleware de autenticación

router.post('/', registerSession);      // POST /api/timer
router.get('/stats', getStats);         // GET /api/timer/stats
router.get('/config', getTimerConfig);  // GET /api/timer/config

// Expone las estadísticas agregadas (pomodoros, descansos, tareas) para el usuario autenticado.
router.get('/statistics', authMiddleware, getAggregatedStats);

module.exports = router;