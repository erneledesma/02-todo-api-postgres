/**
 * Pool de conexiones a Postgres.
 *
 * Se configura enteramente por variables de entorno para que funcione tanto
 * corriendo "suelto" (npm run dev contra un Postgres local) como dentro de
 * docker compose, donde DB_HOST pasa a ser el nombre del servicio ("db")
 * en vez de "localhost".
 */

import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
})

// Chequeo simple al arrancar para dar un error claro si la base no responde
pool.query('SELECT NOW()')
    .then(() => console.log('✅ Conectado a Postgres'))
    .catch((err) => console.error('❌ No se pudo conectar a Postgres:', err.message))
