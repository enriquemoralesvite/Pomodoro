require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const timerRoutes = require('./routes/timer');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Lista de orígenes permitidos
const allowedOrigins = [
  'https://pomodoro-frontend-s9yn.onrender.com',
  'http://localhost:3000' // Para desarrollo local
];

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como desde Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

// Rutas
app.get('/', (req, res) => {
  res.send('API de autenticación funcionando :D');
});

app.use('/api/auth', authRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/tasks', taskRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});