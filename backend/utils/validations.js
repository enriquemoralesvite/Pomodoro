//Expresiones Regulares -> regex

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&-_])[A-Za-z\d$@!%*?&-_]{6,}$/;

const validatePassword = (password) => {
    if (!password) return false; 
    return passwordRegex.test(password); // Verifica si la contraseña cumple con el regex

};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email); // Verifica si el email cumple con el regex 
};

module.exports = {validatePassword, validateEmail};