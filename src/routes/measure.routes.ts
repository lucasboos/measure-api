import { FastifyInstance } from 'fastify';
import { upload, confirm, list } from '../controllers/measure.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export default async (fastify: FastifyInstance) => {
  fastify.post('/upload', { preHandler: authMiddleware }, upload);
  fastify.patch('/confirm', { preHandler: authMiddleware }, confirm);
  fastify.get('/:customer_code/list', { preHandler: authMiddleware }, list);
};