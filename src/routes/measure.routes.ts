import { FastifyInstance } from 'fastify';
import { upload } from '../controllers/measure.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';

export default async (fastify: FastifyInstance) => {
  fastify.post('/upload', upload);
};