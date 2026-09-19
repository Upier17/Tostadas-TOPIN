const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoint de prueba / Healthcheck
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API REST de Tostadas TOPIN funcionando correctamente',
        timestamp: new Date()
    });
});

// Estructura de Rutas de la API REST (PB-04)
// app.use('/api/v1/productos', require('./routes/productos.routes'));
// app.use('/api/v1/pedidos', require('./routes/pedidos.routes'));
// app.use('/api/v1/usuarios', require('./routes/usuarios.routes'));

module.exports = app;