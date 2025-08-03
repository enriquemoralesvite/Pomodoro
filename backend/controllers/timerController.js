
const { query } = require('../config/db');

const registerSession = async (req, res) => {
  try {
    const { userId, taskId, sessionType, duration } = req.body;

    if (!userId || !sessionType || !duration) {
      return res.status(400).json({
        data: null,
        success: false,
        error: 'userId, sessionType y duration son requeridos'
      });
    }

    const validTypes = ['work', 'short_break', 'long_break'];
    if (!validTypes.includes(sessionType)) {
      return res.status(400).json({
        data: null,
        success: false,
        error: 'sessionType debe ser work, short_break o long_break'
      });
    }

    const expectedDurations = {
      work: 25 * 60,
      short_break: 5 * 60,
      long_break: 15 * 60
    };

    if (duration !== expectedDurations[sessionType]) {
      return res.status(400).json({
        data: null,
        success: false,
        error: `La duración debe ser ${expectedDurations[sessionType]} segundos para ${sessionType}`
      });
    }

    if (taskId) {
      const taskCheck = await query(
        'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
        [taskId, userId]
      );
      if (taskCheck.rows.length === 0) {
        return res.status(400).json({
          data: null,
          success: false,
          error: 'Tarea no encontrada o no pertenece al usuario'
        });
      }
    }

    const result = await query(
      'INSERT INTO pomodoro_sessions (user_id, task_id, session_type, duration) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, taskId || null, sessionType, duration]
    );

    res.status(201).json({
      data: { sessionId: result.rows[0].id },
      success: true,
      error: null
    });
  } catch (error) {
    console.error('Error al registrar sesión:', error);
    res.status(500).json({
      data: null,
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({
        data: null,
        success: false,
        error: 'userId es requerido'
      });
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

    res.status(200).json({
      data: sessions.rows,
      success: true,
      error: null
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      data: null,
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const getTimerConfig = (req, res) => {
  const timerConfig = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
  };

  res.status(200).json({
    data: timerConfig,
    success: true,
    error: null
  });
};

module.exports = {
  registerSession,
  getStats,
  getTimerConfig
};