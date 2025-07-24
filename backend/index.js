require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
}));

app.use(express.json()); //Permitir solicitudes JSON ( para parsear los datos body de json)
app.use(express.urlencoded({ extended: true })); //Permitir solicitudes URL-encoded
app.use('/public', express.static('public'));

//Rutas de la aplicacion
app.get('/', (req, res) => {
    res.send('API de autenticacion funcionando :D ');
});

app.use('/api/auth', authRoutes); //Rutas de autenticacion

//Middleware para manejar errores 404
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

//Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});