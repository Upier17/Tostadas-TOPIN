const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión mediante el pool de PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requerido para conexiones SSL seguras con Supabase
    }
});

// Prueba la conexión en la consola al iniciar
pool.connect((err, client, release) => {
    if (err) {
        return console.error('!! Error al conectar con la base de datos de Supabase:', err.stack);
    }
    console.log('!! Conexión exitosa a la base de datos en Supabase !!');
    release();
});

module.exports = pool;