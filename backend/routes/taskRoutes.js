const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Definir las rutas para las tareas
router.route('/')
    .get(getAllTasks) // No requiere autenticación
    .post(createTask); // No requiere autenticación

router.route('/:id')
    .get(getTaskById) // No requiere autenticación
    .put(updateTask) // No requiere autenticación
    .delete(deleteTask); // No requiere autenticación

module.exports = router;
