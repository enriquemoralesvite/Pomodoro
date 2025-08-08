const { query } = require('../config/db');
const Task = require('../models/Task'); // Modelo de tareas

// 📝 Registra una sesión Pomodoro
const registerSession = async (req, res) => {
  try {
    const { userId, taskId, sessionType, duration, recurrente = false } = req.body;

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

    if (typeof recurrente !== 'boolean') {
      return res.status(400).json({
        data: null,
        success: false,
        error: "El campo 'recurrente' debe ser booleano"
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
      `INSERT INTO pomodoro_sessions (user_id, task_id, session_type, duration, recurrente)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, taskId || null, sessionType, duration, recurrente]
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

// 📊 Estadísticas por fecha y tipo de sesión
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

// ⏱️ Configuración estándar del temporizador
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

// 📈 Estadísticas agregadas para el dashboard
const getAggregatedStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const countSessions = async (sessionType) => {
      const result = await query(
        "SELECT COUNT(*) FROM pomodoro_sessions WHERE user_id = $1 AND session_type = $2 AND created_at::date = CURRENT_DATE",
        [userId, sessionType]
      );
      return parseInt(result.rows[0].count, 10);
    };

    const [pomodorosCompleted, shortBreaks, longBreaks, tasksCompleted] = await Promise.all([
      countSessions('work'),
      countSessions('short_break'),
      countSessions('long_break'),
      Task.countCompletedByUserId(userId)
    ]);

    res.status(200).json({
      success: true,
      data: {
        pomodorosCompleted,
        shortBreaks,
        longBreaks,
        tasksCompleted
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas agregadas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al obtener estadísticas'
    });
  }
};

module.exports = {
  registerSession,
  getStats,
  getTimerConfig,
  getAggregatedStats
};