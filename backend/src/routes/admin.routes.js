const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// PB-14: Crear un nuevo producto
router.post('/productos', async (req, res) => {
    const { nombre, descripcion, precio, existencias, imagen_url } = req.body;

    if (!nombre || precio === undefined || existencias === undefined) {
        return res.status(400).json({ status: 'Error', message: 'Faltan campos obligatorios (nombre, precio, existencias).' });
    }

    try {
        const query = `
      INSERT INTO productos (nombre, descripcion, precio, existencias, imagen_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [nombre, descripcion || '', precio, existencias, imagen_url || ''];
        const result = await pool.query(query, values);

        res.status(201).json({ status: 'OK', message: 'Producto creado exitosamente', producto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// PB-14: Actualizar producto existente
router.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, existencias, imagen_url } = req.body;

    try {
        const query = `
      UPDATE productos 
      SET nombre = $1, descripcion = $2, precio = $3, existencias = $4, imagen_url = $5
      WHERE id = $6
      RETURNING *
    `;
        const values = [nombre, descripcion, precio, existencias, imagen_url, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'OK', message: 'Producto actualizado', producto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// PB-14: Eliminar un producto
router.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'OK', message: 'Producto eliminado del catálogo' });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'No se puede eliminar un producto con pedidos vinculados.' });
    }
});

// PB-15: Actualizar únicamente el stock / inventario
router.patch('/productos/:id/stock', async (req, res) => {
    const { id } = req.params;
    const { existencias } = req.body;

    if (existencias === undefined || existencias < 0) {
        return res.status(400).json({ status: 'Error', message: 'Monto de existencias no válido.' });
    }

    try {
        const result = await pool.query(
            'UPDATE productos SET existencias = $1 WHERE id = $2 RETURNING *',
            [existencias, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'OK', message: 'Stock actualizado', producto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// PB-16: Obtener lista general de usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id ASC');
        res.json({ status: 'OK', data: result.rows });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// PB-16: Cambiar rol de usuario (cliente / administrador)
router.patch('/usuarios/:id/rol', async (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['cliente', 'administrador', 'empleado'].includes(rol)) {
        return res.status(400).json({ status: 'Error', message: 'Rol no válido.' });
    }

    try {
        const result = await pool.query(
            'UPDATE usuarios SET rol = $1 WHERE id = $2 RETURNING id, nombre, email, rol',
            [rol, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'Error', message: 'Usuario no encontrado' });
        }

        res.json({ status: 'OK', message: 'Rol actualizado', usuario: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

module.exports = router;