const bcrypt = require('bcryptjs'); // Importar la librería bcrypt para encriptar contraseñas
const saltRounds = 10; // Número de rondas de encriptación

const hashPassword = async (plainPassword) => {
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds); // Encriptar la contraseña
        return hash; // Retornar la contraseña encriptada
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        throw new Error('Error al encriptar la contraseña'); // Lanzar error si ocurre un problema
    }
};
    
const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword); // Comparar la contraseña encriptada con la contraseña en texto plano
        return isMatch; // Retornar true si coinciden, false si no
    } catch (error) {
        console.error('Error al comparar la contraseña:', error);
        return false;
    }
}

module.exports = {hashPassword, comparePassword}; // Exportar las funciones hashPassword y comparePassword para su uso en otros módulos