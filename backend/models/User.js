const db = require('../config/db');
const { hashPassword } = require('../utils/hash');

const User = {
    async findByEmail(email) {
        const query = 'SELECT id, username, email, password_hash FROM users WHERE email = $1';
        try {
            const { rows } = await db.query(query, [email]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario por email', error);
            throw error;
        }
    },

    async findById(id) {
        const query = 'SELECT id, username, email FROM users WHERE id = $1';
        try {
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario por id', error);
            throw error;
        }
    },

    async create({ username, email, password }) {
        const hashedPassword = await hashPassword(password);
        const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email
        `;
        const values = [username, email, hashedPassword];
        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error al crear el usuario', error);
            if (error.code === '23505') { // Unique violation
                throw new Error('El correo electronico o el nombre de usuario ya está registrado');
            }
            throw error;
        }
    }
    // La función updateLastSession no parece tener una columna correspondiente en la nueva tabla,
    // por lo que se omite por ahora para evitar errores.
};

module.exports = User;
