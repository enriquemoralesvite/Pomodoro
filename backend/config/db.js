//const {Pool} = require('pg');// pg = node-postgres 
//require('dotenv').config({path: '../../.env'}); //cargar variables de entorno //oficial

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST || process.env.DB_HOST,
    port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
    database: process.env.PGDATABASE || process.env.DB_DATABASE,
    user: process.env.PGUSER || process.env.DB_USER,
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
    ssl: process.env.PGHOST !== 'localhost' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => console.log('Conexión exitosa a PostgreSQL'));
pool.on('error', (err) => {
    console.error('Error de conexión:', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};  

//text: sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> SELECT * FROM users
//params: parametros de la sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> WHERE id = $1