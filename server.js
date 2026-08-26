/**
 * 02 - TODO API con Postgres
 * Nivel: Intermedio
 *
 * Objetivo:
 * - Reemplazar el array en memoria de la practica 01 por persistencia real en Postgres
 * - Levantar Node + Postgres juntos con Docker Compose (dos contenedores, una red)
 * - Usar el driver "pg" con queries parametrizadas (evitar SQL injection)
 * - Comprobar que los datos sobreviven a un restart del contenedor de la API
 *   (mientras no se borre el volumen de Postgres)
 *
 * Requisitos previos: Docker y Docker Compose instalados.
 * Como correr esta practica: ver README.md
 */

import express from 'express'
import { pool } from './db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// GET /tasks - Listar todas las tareas (con filtro opcional ?status=pending)
app.get('/tasks', async (req, res) => {
    try {
        const { status } = req.query
        const result = status
            ? await pool.query('SELECT * FROM tasks WHERE status = $1 ORDER BY id', [status])
            : await pool.query('SELECT * FROM tasks ORDER BY id')
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /tasks/:id - Obtener una tarea por id
app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /tasks - Crear una nueva tarea
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body

        if (!title) {
            return res.status(400).json({ error: 'Title is required' })
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description, status, due_date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, description || '', status || 'pending', dueDate || null]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// TODO PUT /tasks/:id - Actualizar una tarea existente
// Pistas:
// - Podes usar COALESCE para no pisar los campos que no vengan en el body:
//     UPDATE tasks
//     SET title = COALESCE($1, title),
//         description = COALESCE($2, description),
//         status = COALESCE($3, status),
//         due_date = COALESCE($4, due_date),
//         updated_at = NOW()
//     WHERE id = $5
//     RETURNING *
// - Si "RETURNING *" no devuelve filas, la tarea no existia -> responder 404
app.put('/tasks/:id', async (req, res) => {
    // Tu codigo aca
    res.status(501).json({ error: 'Not implemented yet' })
})

// TODO DELETE /tasks/:id - Eliminar una tarea
// Pistas:
// - DELETE FROM tasks WHERE id = $1 RETURNING *
// - Si no devuelve filas, la tarea no existia -> responder 404
// - Si borra correctamente, responder 204 sin body
app.delete('/tasks/:id', async (req, res) => {
    // Tu codigo aca
    res.status(501).json({ error: 'Not implemented yet' })
})

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
    console.log(`📝 API endpoints available at /tasks`)
})
