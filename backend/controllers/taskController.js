const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user && req.user.id) {
      // Si el usuario está autenticado, obtener sus tareas
      tasks = await Task.findAllByUserId(req.user.id);
    } else {
      // Si no está autenticado, obtener tareas públicas o generales
      tasks = await Task.findAllPublic();
    }

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error del servidor al obtener las tareas",
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, duration, recurrent } = req.body;
    const userId = req.user ? req.user.id : null; // ID del usuario desde el token si existe

    if (!title || !duration) {
      return res
        .status(400)
        .json({
          success: false,
          error: "El título y la duración son obligatorios",
        });
    }

    const newTask = await Task.create({ title, duration, userId, recurrent });
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error del servidor al crear la tarea" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;
    const task = await Task.findById(id, userId);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Tarea no encontrada" });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Error del servidor al obtener la tarea",
      });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;

    const updatedTask = await Task.update(id, taskData);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: "Tarea no encontrada",
      });
    }

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error del servidor al actualizar la tarea",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const deletedTask = await Task.delete(id, userId);

    if (!deletedTask) {
      return res
        .status(404)
        .json({
          success: false,
          error: "Tarea no encontrada",
        });
    }

    res.json({ success: true, message: "Tarea eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Error del servidor al eliminar la tarea",
      });
  }
};
