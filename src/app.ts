import Fastify from 'fastify';
import userRoutes from './routes/user.routes';
import measureRoutes from './routes/measure.routes';
import { AppDataSource } from './config/database';
import env from './config/env';

const app = Fastify();

app.register(userRoutes);
app.register(measureRoutes);

AppDataSource.initialize().then(() => {
  console.log('Database connected');
});

app.listen({ port: Number(env.PORT) }, () => {
  console.log(`Server running on port ${env.PORT}`);
});