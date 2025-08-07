const { query } = require('../config/db');
const Task = require('../models/Task'); // Importar el modelo de Tareas

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

    // NOTA: Duraciones cortas para facilitar las pruebas de desarrollo.
    const expectedDurations = {
      //work: 25 * 60,
      work: 5, // 5 segundos (probando)
      //short_break: 5 * 60,
      short_break: 3, // 3 segundos (probando)
      //long_break: 15 * 60
      long_break: 4 // 4 segundos (probando)
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

// Obtiene un resumen de todas las estadísticas para las tarjetas del dashboard.
const getAggregatedStats = async (req, res) => {
  try {
    const userId = req.user.id; // El ID de usuario se obtiene del token JWT a través del middleware.

    // FIX: Se cuentan solo las sesiones del día actual para las estadísticas, según feedback.
    const countSessions = async (sessionType) => {
      const result = await query(
        "SELECT COUNT(*) FROM pomodoro_sessions WHERE user_id = $1 AND session_type = $2 AND created_at::date = CURRENT_DATE",
        [userId, sessionType]
      );
      return parseInt(result.rows[0].count, 10);
    };

    // Se ejecutan todas las consultas de conteo en paralelo para mayor eficiencia.
    const [pomodorosCompleted, shortBreaks, longBreaks, tasksCompleted] = await Promise.all([
      countSessions('work'),
      countSessions('short_break'),
      countSessions('long_break'),
      Task.countCompletedByUserId(userId) // Llama al nuevo método del modelo Task.
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
  getAggregatedStats // Se exporta la nueva función
};