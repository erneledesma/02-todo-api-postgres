# Practica 02 - TODO API con Docker + Node + Postgres

## Objetivo

Extender la practica 01 (API en memoria) para persistir las tareas en una
base de datos Postgres real, corriendo todo con Docker Compose: un
contenedor para la API de Node/Express y otro para Postgres.

Al terminar esta practica vas a poder:

- Levantar un entorno multi-contenedor con `docker compose up`
- Explicar por que, dentro de la red de Compose, el host de la base es el
  nombre del servicio (`db`) y no `localhost`
- Usar el driver `pg` con queries parametrizadas
- Verificar que los datos sobreviven a un restart de la API, algo que en la
  practica 01 no pasaba porque los datos vivian en un array en memoria

## Estructura

```
02-todo-api-postgres/
├── db/
│   └── init.sql        # Se ejecuta una sola vez al crear el volumen de Postgres
├── db.js               # Pool de conexion a Postgres
├── server.js           # API Express (con TODOs para completar PUT y DELETE)
├── Dockerfile           # Imagen de la API
├── docker-compose.yml   # Orquesta API + Postgres
├── .env.example         # Copiar a .env y ajustar si hace falta
├── .dockerignore
└── package.json
```

## Como correr

1. Copiar las variables de entorno:

   ```
   cp .env.example .env
   ```

2. Levantar todo (construye la imagen de la API y descarga Postgres):

   ```
   docker compose up --build
   ```

3. La API queda en `http://localhost:3001/tasks`. Postgres tambien queda
   expuesto en `localhost:5432` por si queres conectarte con `psql`, DBeaver,
   TablePlus, etc.

4. Para parar todo:

   ```
   docker compose down
   ```

   Los datos quedan guardados en el volumen `todo_pgdata` (sobreviven a esto).
   Para borrar tambien los datos:

   ```
   docker compose down -v
   ```

## Probar los endpoints

```
curl http://localhost:3001/tasks
curl http://localhost:3001/tasks/1
curl http://localhost:3001/tasks?status=pending

curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","description":"probando","status":"pending"}'

curl -X PUT http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

curl -X DELETE http://localhost:3001/tasks/1
```

## Ejercicios (TODO)

1. Implementar `PUT /tasks/:id` en `server.js` (hay pistas comentadas en el archivo).
2. Implementar `DELETE /tasks/:id`.
3. Bonus: probar el filtro `GET /tasks?status=pending` (ya esta soportado por la query).
4. Bonus: reiniciar solo el contenedor de la API (`docker compose restart api`)
   y confirmar que las tareas siguen ahi, a diferencia de la practica 01
   donde se perdian.
5. Bonus: correr `docker compose down -v` y notar que ahi si se pierden los
   datos, porque se borra el volumen de Postgres.
6. Bonus avanzado: agregar validacion de `status` (solo permitir
   `pending` / `completed`) devolviendo 400 si viene otro valor.

## Diferencias clave vs la practica 01

| Aspecto | 01 - En memoria | 02 - Postgres + Docker |
|---|---|---|
| Persistencia | Array en JS, se pierde al reiniciar | Postgres, sobrevive a restarts de la API |
| Infraestructura | Solo `node server.js` | Docker Compose con 2 servicios |
| Acceso a datos | Nada, es JS puro | SQL parametrizado con `pg` |
| Arranque | Instantaneo | Hay que esperar a que Postgres este listo (`healthcheck` + `depends_on`) |

## Troubleshooting

- **Puerto 5432 ya en uso**: si tenes Postgres corriendo localmente, cambia
  el mapeo de puertos en `docker-compose.yml` (por ejemplo `"5433:5432"`).
- **La API intenta conectarse antes de que la base este lista**: el
  `healthcheck` de `db` + `depends_on: condition: service_healthy` en `api`
  estan pensados justo para evitar esto. Si igual falla, volve a correr
  `docker compose up`.
- **Cambios en `server.js` no se reflejan**: la imagen se construye una sola
  vez; despues de editar el codigo hay que correr `docker compose up --build`
  de nuevo. Migrar a un volumen + `nodemon` para hot reload dentro del
  contenedor queda como desafio extra.
- **`init.sql` no crea la tabla**: ese script solo corre la primera vez que
  se crea el volumen. Si ya habias levantado el proyecto antes, borra el
  volumen (`docker compose down -v`) y volve a levantar.
