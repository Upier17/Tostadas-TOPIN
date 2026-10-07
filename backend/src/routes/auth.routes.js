const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ status: 'Error', message: 'Todos los campos son obligatorios' });
    }

    try {
        const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ status: 'Error', message: 'El correo electrónico ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
            [nombre, email, password_hash, 'cliente']
        );

        const token = jwt.sign(
            { id: newUser.rows[0].id, rol: newUser.rows[0].rol },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            status: 'OK',
            message: 'Usuario registrado exitosamente',
            user: newUser.rows[0],
            token
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// PB-10: Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'Error', message: 'Ingresa correo y contraseña' });
    }

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ status: 'Error', message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ status: 'Error', message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            status: 'OK',
            message: 'Inicio de sesión exitoso',
            user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
            token
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

module.exports = router;