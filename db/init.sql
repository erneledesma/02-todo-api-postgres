-- Se ejecuta automaticamente UNA SOLA VEZ, cuando Postgres crea el volumen por primera vez
-- (carpeta especial docker-entrypoint-initdb.d). Si ya existe el volumen, este script
-- no se vuelve a correr aunque reinicies los contenedores.

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Datos de ejemplo, en el mismo espiritu que los de la practica 01
INSERT INTO tasks (title, description, status, due_date) VALUES
    ('Task 1', 'Description 1', 'completed', '2026-08-15'),
    ('Task 2', 'Description 2', 'pending', '2026-08-16');
