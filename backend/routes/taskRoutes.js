const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Definir las rutas para las tareas
router.route('/')
    .get(getAllTasks) // No requiere autenticación
    .post(authMiddleware, createTask); // Requiere autenticación solo para crear tareas

router.route('/:id')
    .get(getTaskById) // No requiere autenticación
    .put(updateTask) // No requiere autenticación
    .delete(authMiddleware, deleteTask); // Requiere autenticación solo para eliminar tareas

module.exports = router;
