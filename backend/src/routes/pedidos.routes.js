const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// PB-11: Registrar nuevo pedido (asocia el usuario_id si hay sesión activa)
router.post('/', async (req, res) => {
    const { usuario_id, items, total } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ status: 'Error', message: 'El carrito está vacío' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const pedidoResult = await client.query(
            'INSERT INTO pedidos (usuario_id, total, estado) VALUES ($1, $2, $3) RETURNING id, creado_en',
            [usuario_id || null, total, 'pendiente']
        );
        const pedidoId = pedidoResult.rows[0].id;

        for (const item of items) {
            await client.query(
                'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [pedidoId, item.id, item.cantidad, item.precio]
            );

            await client.query(
                'UPDATE productos SET existencias = existencias - $1 WHERE id = $2 AND existencias >= $1',
                [item.cantidad, item.id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ status: 'OK', message: 'Pedido registrado con éxito', pedidoId });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ status: 'Error', message: error.message });
    } finally {
        client.release();
    }
});

// PB-12: Consultar pedidos (filtrados por rol/usuario)
router.get('/', async (req, res) => {
    const { usuario_id, rol } = req.query;

    try {
        let query = `
      SELECT p.id, p.total, p.estado, p.creado_en, p.usuario_id,
             COALESCE(u.nombre, 'Cliente Mostrador') AS cliente
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
    `;
        const params = [];

        // Si es cliente, filtrar únicamente sus pedidos
        if (rol === 'cliente' && usuario_id) {
            query += ` WHERE p.usuario_id = $1`;
            params.push(usuario_id);
        }

        query += ` ORDER BY p.creado_en DESC`;

        const result = await pool.query(query, params);
        res.json({ status: 'OK', data: result.rows });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// PB-12: Actualizar estado (Exclusivo para Empleados / Administradores)
router.patch('/:id/estado', async (req, res) => {
    const { id } = req.params;
    const { estado, rol } = req.body;

    if (rol !== 'empleado' && rol !== 'administrador') {
        return res.status(403).json({ status: 'Error', message: 'No tienes permisos para modificar pedidos.' });
    }

    try {
        const result = await pool.query(
            'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', message: 'Pedido no encontrado' });
        }

        res.json({ status: 'OK', message: 'Estado actualizado', pedido: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

module.exports = router;