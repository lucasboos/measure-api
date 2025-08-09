import Fastify from 'fastify';
import userRoutes from './routes/user.routes';
import measureRoutes from './routes/measure.routes';
import { AppDataSource } from './config/database';
import env from './config/env';

async function startServer() {
  const app = Fastify();

  app.register(userRoutes);
  app.register(measureRoutes);

  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    await app.listen({ port: Number(env.PORT), host: '0.0.0.0' });
    console.log(`v1.0 - Server running on port ${env.PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();