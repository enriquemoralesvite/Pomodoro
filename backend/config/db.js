const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGHOST !== 'localhost' ? { rejectUnauthorized: false } : false
});

// Función autoinvocada para "calentar" la conexión y asegurar que esté lista.
(async () => {
  try {
    await pool.query('SELECT NOW()'); // Realiza una consulta simple para forzar la conexión.
    console.log('✅ Conexión a la base de datos verificada y lista.');
  } catch (err) {
    console.error('❌ Error al verificar la conexión con la base de datos:', err);
    process.exit(-1); // Si la conexión inicial falla, detiene la aplicación.
  }
})();


pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente de la base de datos:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

//text: sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> SELECT * FROM users
//params: parametros de la sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> WHERE id = $1