require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);

app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'OK', message: '!! API REST en ejecución !!' });
});

app.get('/api/v1/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'OK',
            message: '!! Respuesta recibida de la DB !!',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Error', error: error.message });
    }
});

app.get('/api/v1/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
        res.json({
            status: 'OK',
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('!! Backend activo. /api/v1/health | /api/v1/test-db');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`!! Servidor backend escuchando en http://localhost:${PORT}`);
});