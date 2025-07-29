const { query } = require('./config/db');

async function testConnection() {
    try {
        const result = await query('SELECT NOW()');
        console.log('✅ Conexión exitosa:', result.rows[0]);
    } catch (error) {
        console.error('❌ Error en la conexión:', error);
    } finally {
        process.exit();
    }
}

testConnection();