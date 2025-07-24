//const {Pool} = require('pg');// pg = node-postgres 
//require('dotenv').config({path: '../../.env'}); //cargar variables de entorno //oficial

require('dotenv').config(); //borrar si no funciona
const {Pool} = require('pg');// pg = node-postgres 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) //borrar si no funciona
//  port: process.env.DB_PORT, //oficial
})

pool.on('connect', () => {
    console.log('Conectado a la base de datos');
});

pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos', err);
    process.exit(-1); // Salir del proceso si hay un error   
})

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};

//text: sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> SELECT * FROM users
//params: parametros de la sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> WHERE id = $1