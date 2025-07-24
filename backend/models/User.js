const db = require('../config/db');
const { hashPassword } = require('../utils/hash');

//Esto es un objeto literal
const User = {
    async findByEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        try {
            const { rows } = await db.query(query, [email]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario por email', error);
            throw error;
        }
    },

    async findById(id_usuario) {
        const query = 'SELECT id_usuario, nombres, email FROM usuarios WHERE id_usuario = $1';
        try {
            const { rows } = await db.query(query, [id_usuario]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario por id', error);
            throw error;
        }
    },

    async create({ Nombres, Email, Contrasena }) {
        const hashedPassword = await hashPassword(Contrasena);
        const query = `
            INSERT INTO usuarios (nombres, email, contrasena)
            VALUES ($1, $2, $3)
            RETURNING id_usuario, nombres, email
        `;
        const values = [Nombres, Email, hashedPassword];
        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error al crear el usuario', error);
            if (error.code === '23505') {
                throw new Error('El correo electronico ya está registrado');
            }
            throw error;
        }
    },

    async updateLastSession(id_usuario) {
        const query = 'UPDATE usuarios SET ultima_sesion = NOW() WHERE id_usuario = $1';
        try {
            await db.query(query, [id_usuario]);
        } catch (error) {
            console.error('Error al actualizar la última sesión:', error);
        }
    }
};

module.exports = User;