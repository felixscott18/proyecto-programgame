import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { HTTP_STATUS } from './utils/httpCodes.js';
import swaggerSpec from './config/swagger.js';

const app = express();

const buildCorsOrigin = () => {
  const configured = process.env.CORS_ORIGIN;
  if (!configured) {
    return true;
  }

  const whitelist = configured.split(',').map((origin) => origin.trim());
  return (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  };
};

app.use(cors({ origin: buildCorsOrigin(), credentials: true }));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/api/v1/health', (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

app.use(
  '/api-docs',
  (_req, res, next) => {
    res.removeHeader('Content-Security-Policy');
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Retro Coder API Docs',
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
