# Retro Coder Backend

Backend basado en la plantilla para servir autenticación JWT, productos y documentación Swagger.

## Iniciar

1. Copia `.env.example` a `.env`.
2. Configura `MONGO_URI`, `JWT_SECRET` y `CORS_ORIGIN`.
3. Ejecuta:

```bash
cd Backend
npm install
npm run dev
```

## Rutas principales

- `GET /api/v1/health` — estado de la API
- `POST /api/v1/auth/register` — registrar usuario
- `POST /api/v1/auth/login` — iniciar sesión
- `GET /api/v1/products` — listar productos (requiere JWT)
- `POST /api/v1/products` — crear producto (requiere JWT)
- `GET /api/v1/products/:id` — obtener producto por id (requiere JWT)
- `PATCH /api/v1/products/:id` — actualizar producto (requiere JWT)
- `DELETE /api/v1/products/:id` — eliminar producto (requiere JWT)

## Documentación

- `http://localhost:5000/api-docs`
