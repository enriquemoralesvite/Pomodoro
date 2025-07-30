const User = require('../models/User');
const { comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { validatePassword, validateEmail } = require('../utils/validations');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'El correo electronico no es valido' });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres, una mayuscula, una minuscula, un numero y un caracter especial' });
    }
    try {
        const newUser = await User.create({ username, email, password });

        const tokenPayload = { id: newUser.id, email: newUser.email };
        const token = generateToken(tokenPayload);

        res.status(201).json({ 
            message: 'Usuario creado correctamente',
            token,
            user: {
                id: newUser.id, 
                username: newUser.username, 
                email: newUser.email
            }
        });

    } catch (error) {
        if (error.message.includes('ya está registrado')) {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error en el registro', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Correo electronico y contraseña son obligatorios' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'El formato de correo electronico no es valido' });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales no validas' });
        }

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales no validas' });
        }

        // La funcionalidad de 'updateLastSession' fue omitida del modelo porque la columna no existe.

        const tokenPayload = { id: user.id, email: user.email };
        const token = generateToken(tokenPayload);

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id, 
                username: user.username, 
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en el login', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {register, login};
