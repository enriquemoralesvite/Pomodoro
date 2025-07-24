const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Generar token con payload y secret
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET); // Verificar token con secret
    }
    catch (error) {
        console.error('Token invalido o expirado', error.message); // Manejar error si el token es invalido o expirado
        return null; // Retornar null si hay un error
    }
}

module.exports = {generateToken, verifyToken};