const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGHOST !== 'localhost' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => console.log('✅ Conexión exitosa a PostgreSQL'));

pool.on('error', (err) => {
  console.error('❌ Error de conexión:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

//text: sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> SELECT * FROM users
//params: parametros de la sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> WHERE id = $1