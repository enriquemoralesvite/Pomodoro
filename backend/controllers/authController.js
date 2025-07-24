//Logica de rutas

const User = require('../models/User'); // Importar el modelo de usuario
const { comparePassword } = require('../utils/hash'); // Importar la función de comparación de contraseñas
const { generateToken } = require('../utils/jwt'); // Importar la función de generación de token
const { validatePassword, validateEmail } = require('../utils/validations'); // Importar las funciones de validación de contraseña y email

const register = async (req, res) => {
    const { Nombres, Email, Contrasena } = req.body; // Desestructuración del objeto user
    if (!Nombres || !Email || !Contrasena) { // Validar que los campos no estén vacíos
        return res.status(400).json({ message: 'Todos los campos son obligatorios' }); // 400 -> significa Bad Request
    }
    if (!validateEmail(Email)) { // Validar el formato del email
        return res.status(400).json({ message: 'El correo electronico no es valido' });
    }
    if (!validatePassword(Contrasena)) { // Validar el formato de la contraseña
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres, una mayuscula, una minuscula, un numero y un caracter especial' });
    }
    try {

        const newUser = await User.create({ Nombres, Email, Contrasena }); // Crear el usuario en la base de datos

        const tokenPayload = { id_usuario: newUser.id_usuario, email: newUser.email }; // Crear el payload del token
        const token = generateToken(tokenPayload); // Generar el token

        res.status(201).json({ 
            message: 'Usuario creado correctamente', // 201 -> significa Created
            token, // Retornar el token
            user: {
                id: newUser.id_usuario, 
                nombres: newUser.nombres, 
                email: newUser.email
            }
        });

    } catch (error) {
        if (error.message === 'El correo electronico ya está registrado') { // Manejo de errores
            return res.status(409).json({ message: error.message }); // 409 -> significa Conflict
        }
        console.error('Error en el registro', error); // Manejo de errores
        res.status(500).json({ message: 'Error interno del servidor' }); // 500 -> significa Internal Server Error
    }
};

const login = async (req, res) => {
    const { Email, Contrasena } = req.body; // Desestructuración del objeto user

    if (!Email || !Contrasena) { // Validar que los campos no estén vacíos
        return res.status(400).json({ message: 'Correo electronico y contraseña son obligatorios' }); // 400 -> significa Bad Request
    }
    if (!validateEmail(Email)) { // Validar el formato del email
        return res.status(400).json({ message: 'El formato de correo electronico no es valido' });
    }

    try {
        const user = await User.findByEmail(Email); // Buscar el usuario por email
        if (!user) { // Si no se encuentra el usuario
            return res.status(401).json({ message: 'Credenciales no validas' }); // 401 -> significa Unauthorized
        }

        const isMatch = await comparePassword(Contrasena, user.contrasena); // Comparar la contraseña
        if (!isMatch) { // Si la contraseña no coincide
            return res.status(401).json({ message: 'Credenciales no validas' }); // 401 -> significa Unauthorized
        }

        await User.updateLastSession(user.id_usuario); // Actualizar la última sesión

        const tokenPayload = { id_usuario: user.id_usuario, email: user.email }; // Crear el payload del token
        const token = generateToken(tokenPayload); // Generar el token

        res.status(200).json({ // 200 -> significa OK
            message: 'Inicio de sesión exitoso',
            token, // Retornar el token
            user: {
                id: user.id_usuario, 
                nombres: user.nombres, 
                email: user.email
            }

        });

    } catch (error) {
        console.error('Error en el login', error); // Manejo de errores
        res.status(500).json({ message: 'Error interno del servidor' }); // 500 -> significa Internal Server Error
    }
    
};

module.exports = {register, login}; // Exportar las funciones de registro e inicio de sesión