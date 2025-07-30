// backend/routes/pomodoro.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// POST /api/timer - Registrar una sesión de Pomodoro
router.post('/', async (req, res) => {
  try {
    const { userId, taskId, sessionType, duration } = req.body;

    // Validar datos
    if (!userId || !sessionType || !duration) {
      return res.status(400).json({ error: 'userId, sessionType y duration son requeridos' });
    }

    // Validar tipo de sesión según el CHECK constraint de la base de datos
    if (!['work', 'short_break', 'long_break'].includes(sessionType)) {
      return res.status(400).json({ error: 'sessionType debe ser work, short_break o long_break' });
    }

    // Validar duración según el tipo de sesión
    const expectedDurations = {
      work: 25 * 60,
      short_break: 5 * 60,
      long_break: 15 * 60
    };

    if (duration !== expectedDurations[sessionType]) {
      return res.status(400).json({ 
        error: `La duración debe ser ${expectedDurations[sessionType]} segundos para una sesión de tipo ${sessionType}` 
      });
    }

    // Si se proporciona taskId, verificar que exista y pertenezca al usuario
    if (taskId) {
      const taskCheck = await query(
        'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
        [taskId, userId]
      );
      if (taskCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Tarea no encontrada o no pertenece al usuario' });
      }
    }

    // Insertar sesión en la base de datos
    const result = await query(
      'INSERT INTO pomodoro_sessions (user_id, task_id, session_type, duration) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, taskId || null, sessionType, duration]
    );

    res.status(201).json({ 
      message: 'Sesión de Pomodoro registrada',
      sessionId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error al registrar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/timer/stats - Obtener estadísticas de sesiones por usuario
router.get('/stats', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId es requerido' });
    }

    const sessions = await query(
      `SELECT 
        DATE(created_at) as session_date,
        session_type,
        COUNT(*) as count,
        SUM(duration) as total_duration
      FROM pomodoro_sessions 
      WHERE user_id = $1 
      GROUP BY DATE(created_at), session_type 
      ORDER BY session_date DESC`,
      [userId]
    );

    res.status(200).json(sessions.rows);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/timer/config - Obtener configuración del temporizador
router.get('/config', (req, res) => {
  const timerConfig = {
    work: 25 * 60,        // 25 minutos en segundos
    short_break: 5 * 60,  // 5 minutos en segundos
    long_break: 15 * 60   // 15 minutos en segundos
  };
  res.json(timerConfig);
});

module.exports = router;