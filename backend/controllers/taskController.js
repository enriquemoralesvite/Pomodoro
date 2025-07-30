const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
    try {
        // El id del usuario se obtiene del token JWT verificado por el middleware
        const tasks = await Task.findAllByUserId(req.user.id);
        res.json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor al obtener las tareas' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, duration } = req.body;
        const userId = req.user.id; // ID del usuario desde el token

        if (!title || !duration) {
            return res.status(400).json({ success: false, error: 'El título y la duración son obligatorios' });
        }

        const newTask = await Task.create({ title, duration, userId });
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor al crear la tarea' });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const task = await Task.findById(id, userId);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
        }

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor al obtener la tarea' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const taskData = req.body;

        const updatedTask = await Task.update(id, taskData, userId);

        if (!updatedTask) {
            return res.status(404).json({ success: false, error: 'Tarea no encontrada o no pertenece al usuario' });
        }

        res.json({ success: true, data: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor al actualizar la tarea' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedTask = await Task.delete(id, userId);

        if (!deletedTask) {
            return res.status(404).json({ success: false, error: 'Tarea no encontrada o no pertenece al usuario' });
        }

        res.json({ success: true, message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor al eliminar la tarea' });
    }
};
