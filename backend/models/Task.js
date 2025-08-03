const db = require('../config/db');

const Task = {
    async findAllByUserId(userId) {
        // FIX: Se filtra por is_active = true para devolver solo las tareas activas, según feedback.
        const query = 'SELECT id, title, description, status, duration, is_active FROM tasks WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC';
        try {
            const { rows } = await db.query(query, [userId]);
            return rows;
        } catch (error) {
            console.error('Error al buscar las tareas del usuario', error);
            throw error;
        }
    },

    async findById(taskId, userId) {
        const query = 'SELECT id, title, description, status, duration, is_active FROM tasks WHERE id = $1 AND user_id = $2';
        try {
            const { rows } = await db.query(query, [taskId, userId]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar la tarea por id', error);
            throw error;
        }
    },

    async create({ title, duration, userId }) {
        // El frontend solo envía title y duration. Description es opcional, status tiene un valor por defecto.
        const query = `
            INSERT INTO tasks (title, duration, user_id, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING id, title, duration, status, created_at
        `;
        const values = [title, duration, userId];
        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error al crear la tarea', error);
            throw error;
        }
    },

    async update(taskId, taskData, userId) {
        // FIX: Se construye la consulta dinámicamente para actualizar solo los campos proporcionados.
        // Esto evita que se intenten actualizar campos no nulos (como status) con valores NULL cuando no se envían.
        const fields = [];
        const values = [];
        let valueIndex = 1;

        // Se añaden los campos a actualizar solo si existen en el objeto taskData
        if (taskData.title !== undefined) {
            fields.push(`title = $${valueIndex++}`);
            values.push(taskData.title);
        }
        if (taskData.description !== undefined) {
            fields.push(`description = $${valueIndex++}`);
            values.push(taskData.description);
        }
        if (taskData.status !== undefined) {
            fields.push(`status = $${valueIndex++}`);
            values.push(taskData.status);
        }
        if (taskData.duration !== undefined) {
            fields.push(`duration = $${valueIndex++}`);
            values.push(taskData.duration);
        }

        // Si no hay campos para actualizar, no se hace nada y se devuelve la tarea original.
        if (fields.length === 0) {
            return this.findById(taskId, userId);
        }

        // Se añaden los IDs para el WHERE de la consulta
        values.push(taskId, userId);

        const query = `
            UPDATE tasks
            SET ${fields.join(', ')}
            WHERE id = $${valueIndex++} AND user_id = $${valueIndex++}
            RETURNING id, title, description, status, duration
        `;

        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error al actualizar la tarea', error);
            throw error;
        }
    },

    async delete(taskId, userId) {
        // FIX: Se implementa el borrado lógico cambiando is_active a false, según feedback.
        const query = 'UPDATE tasks SET is_active = false WHERE id = $1 AND user_id = $2 RETURNING id';
        try {
            const { rows } = await db.query(query, [taskId, userId]);
            return rows[0];
        } catch (error) {
            console.error('Error al eliminar la tarea', error);
            throw error;
        }
    }
};

module.exports = Task;