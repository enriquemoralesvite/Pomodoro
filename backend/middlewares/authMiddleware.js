
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No se proporcionó un token de autenticación o el formato es incorrecto.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }

        const user = await User.findById(decoded.id_usuario);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = authMiddleware;
