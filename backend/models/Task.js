const db = require("../config/db");

const Task = {
  async findAllByUserId(userId) {
    // Se filtra por is_active = true para devolver solo las tareas activas, según feedback.
    const query =
      "SELECT id, title, description, status, duration, is_active, recurrent FROM tasks WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC";
    try {
      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Error al buscar las tareas del usuario", error);
      throw error;
    }
  },

  async findById(taskId, userId) {
    const query =
      "SELECT id, title, description, status, duration, is_active FROM tasks WHERE id = $1 AND user_id = $2";
    try {
      const { rows } = await db.query(query, [taskId, userId]);
      return rows[0];
    } catch (error) {
      console.error("Error al buscar la tarea por id", error);
      throw error;
    }
  },

  async create({ title, duration, userId, recurrent }) {
    // El frontend solo envía title y duration. Description es opcional, status tiene un valor por defecto.
    const query = `
            INSERT INTO tasks (title, duration, user_id, status, recurrent)
            VALUES ($1, $2, $3, 'pending', $4 )
            RETURNING id, title, duration, status, created_at, recurrent
        `;
    const values = [title, duration, userId, recurrent];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error al crear la tarea", error);
      throw error;
    }
  },

  async update(taskId, taskData, userId) {
    // Se utiliza una consulta específica y no dinámica para la actualización de estado, que es el caso problemático.
    // Esto evita la ambigüedad que confundía al driver de la base de datos.
    if (taskData.status && Object.keys(taskData).length === 1) {
      const newStatus = taskData.status;
      // Se usa CURRENT_TIMESTAMP para la fecha de completado y NULL si se desmarca.
      // Esto se inyecta directamente en la consulta, lo cual es seguro porque no viene del usuario.
      const completedAtClause =
        newStatus === "completed"
          ? "completed_at = CURRENT_TIMESTAMP"
          : "completed_at = NULL";

      const query = `
                UPDATE tasks
                SET status = $1, ${completedAtClause}
                WHERE id = $2 AND user_id = $3
                RETURNING id, title, description, status, duration
            `;
      const values = [newStatus, taskId, userId];

      try {
        const { rows } = await db.query(query, values);
        return rows[0];
      } catch (error) {
        console.error("Error al actualizar la tarea", error);
        throw error;
      }
    }

    // Lógica dinámica corregida para otras actualizaciones (ej. cambiar título, duración, etc.)
    const fields = [];
    const values = [];
    let valueIndex = 1;

    if (taskData.title !== undefined) {
      fields.push(`title = $${valueIndex++}`);
      values.push(taskData.title);
    }
    if (taskData.description !== undefined) {
      fields.push(`description = $${valueIndex++}`);
      values.push(taskData.description);
    }
    if (taskData.duration !== undefined) {
      fields.push(`duration = $${valueIndex++}`);
      values.push(taskData.duration);
    }

    if (fields.length === 0) {
      // Si no hay campos para actualizar, no se hace nada.
      return this.findById(taskId, userId);
    }

    values.push(taskId, userId);

    const query = `
            UPDATE tasks
            SET ${fields.join(", ")}
            WHERE id = $${valueIndex++} AND user_id = $${valueIndex++}
            RETURNING id, title, description, status, duration
        `;

    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error al actualizar la tarea", error);
      throw error;
    }
  },

  async delete(taskId, userId) {
    // Se implementa el borrado lógico cambiando is_active a false, según feedback.
    const query =
      "UPDATE tasks SET is_active = false WHERE id = $1 AND user_id = $2 RETURNING id";
    try {
      const { rows } = await db.query(query, [taskId, userId]);
      return rows[0];
    } catch (error) {
      console.error("Error al eliminar la tarea", error);
      throw error;
    }
  },

  // Se cuentan solo las tareas completadas en el día actual, según feedback.
  async countCompletedByUserId(userId) {
    const query =
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status = 'completed' AND completed_at::date = CURRENT_DATE";
    try {
      const { rows } = await db.query(query, [userId]);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      console.error("Error al contar las tareas completadas", error);
      throw error;
    }
  },
};

module.exports = Task;
