import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db';
import authRoutes from './server/routes/authRoutes';
import bugRoutes from './server/routes/bugRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Read body content as JSON
  app.use(express.json());

  // Connect to MongoDB
  console.log('🔄 [Server]: Conectando con Mongoose...');
  await connectDB();

  // MVC Routes mounted as REST API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/bugs', bugRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'UP', 
      development: process.env.NODE_ENV !== 'production',
      time: new Date()
    });
  });

  // Vite middleware integration based on runtime environment
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔄 [Server]: Buscando middleware de desarrollo de Vite...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('📦 [Server]: Servidor levantado en producción. Sirviendo archivos desde dist/');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Server]: Listo y corriendo en http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('💥 [Server]: Error al arrancar el servidor:', error);
});
