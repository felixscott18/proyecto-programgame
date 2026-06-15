Proyecto Fullstack (chase-main)
Descripción

Repositorio fullstack con backend en Node.js (carpeta Backend) y frontend con Vite/TypeScript (carpeta Frontend). Incluye además una plantilla de ejemplo en plantilla.
Estructura principal

Backend: API REST, controladores, modelos, rutas y middlewares.
Frontend: aplicación cliente (Vite, React/TS).
uploads/: directorio para archivos subidos.
plantilla: ejemplo de estructura backend/frontend similar.
Requisitos

Node.js (recomendado >= 16)
npm o yarn
MongoDB u otra base de datos según configuración (variables de entorno)
Variables de entorno (ejemplos)

PORT — puerto del servidor
MONGO_URI o DB_URI — cadena de conexión a la base de datos
JWT_SECRET — clave JWT para autenticación
UPLOAD_DIR — ruta para subir archivos (opcional)
Instalación y ejecución

Backend

Ir a la carpeta del backend:
cd Backend
Instalar dependencias:
npm install
Ejecutar en desarrollo (si existe script):
npm run dev
Ejecutar en producción:
npm start (o node server.js)
Frontend

Ir a la carpeta del frontend:
cd Frontend
Instalar dependencias:
npm install
Ejecutar en desarrollo:
npm run dev
Construir para producción:
npm run build
Servir build (según configuración del proyecto)
Configuración rápida

Crear .env en Backend con las variables necesarias.
Asegurarse de que la base de datos esté accesible.
Levantar el backend y luego el frontend (si ambos son necesarios).
Puntos importantes

Rutas de API y controladores se encuentran en routes y Controllers.
Validaciones y middlewares en middlewares y validators.
Modelos en Models.
El frontend usa Vite; revisar package.json para scripts exactos.
Despliegue

Construir el frontend con npm run build y servir los archivos estáticos desde un servidor (o integrar con el backend).
Para producción, usar process manager (pm2, systemd) o contenedores Docker (opcional).
Pruebas

Revisar si hay scripts de test en package.json de cada carpeta:
npm test o npm run test
Contribuir

Abrir issues para bugs o mejoras.
Hacer fork / branch por feature y enviar pull requests con descripciones claras.
