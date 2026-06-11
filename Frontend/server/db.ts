import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar primero `.env.local` para desarrollo local, luego `.env` como respaldo.
dotenv.config({ path: '.env.local' });
dotenv.config();

let isConnected = false;
const MONGO_URI = process.env.MONGODB_URI || '';

export async function connectDB() {
  if (isConnected) {
    return true;
  }

  if (!MONGO_URI) {
    console.warn('⚠️ [MongoDB/Mongoose]: MONGODB_URI no está configurada en las variables de entorno.');
    console.warn('⚠️ [MongoDB/Mongoose]: Iniciando servidor Express con base de datos simulada en memoria para la vista previa.');
    return false;
  }

  try {
    // Set connection timeout to 4 seconds to fail fast if DB is offline, preventing hanging
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    console.log('✅ [MongoDB/Mongoose]: Conexión exitosa a la base de datos.');
    return true;
  } catch (error: any) {
    console.error('❌ [MongoDB/Mongoose]: Error al conectar a MongoDB:', error.message);
    console.warn('⚠️ [MongoDB/Mongoose]: Iniciando servidor Express con base de datos simulada para evitar caídas en el preview.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
