const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger todas las rutas de tareas con el middleware de autenticación
router.use(authMiddleware);

// Definir las rutas para las tareas
router.route('/')
    .get(getAllTasks)
    .post(createTask);

router.route('/:id')
    .get(getTaskById)
    .put(updateTask) // El frontend usa 'UPDATE' pero el estándar RESTful es PUT o PATCH. Usamos PUT.
    .delete(deleteTask);

module.exports = router;
