import swaggerJsdoc from 'swagger-jsdoc';

const openApiDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Retro Coder API',
    version: '1.0.0',
    description: 'API de autenticación y gestión de productos para el frontend Retro Coder.'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor local de desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token. Usa POST /api/v1/auth/login para obtenerlo.'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664a1f2e3b4c5d6e7f8a9b0c' },
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664b2a3c4d5e6f7a8b9c0d1e' },
          name: { type: 'string', example: 'Wireless Mouse' },
          description: { type: 'string', example: 'Ergonomic wireless mouse with USB receiver.' },
          price: { type: 'number', format: 'float', example: 29.99 },
          stock: { type: 'integer', example: 150 },
          image: { type: 'string', example: '/uploads/1716400000000-mouse.jpg' },
          createdBy: { type: 'string', example: '664a1f2e3b4c5d6e7f8a9b0c' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation error - email: Email must be valid' }
        }
      }
    }
  }
};

const swaggerJsdocOptions = {
  definition: openApiDefinition,
  apis: ['./src/app.js', './src/routes/authRoutes.js', './src/routes/productRoutes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerJsdocOptions);
export default swaggerSpec;
