const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController'); // Importar los controladores de autenticación

const router = express.Router(); // Crear un router de Express

router.post('/register', register); // Ruta para registrar un nuevo usuario
router.post('/login', login); // Ruta para iniciar sesión
router.post('/refresh-token', refreshToken); // Ruta para refrescar el token de acceso

module.exports = router; // Exportar el router