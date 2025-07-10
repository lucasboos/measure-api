import { FastifyInstance } from 'fastify';
import { upload, confirm, list } from '../controllers/measure.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';

export default async (fastify: FastifyInstance) => {
  fastify.post('/upload', upload);
  fastify.patch('/confirm', confirm);
  fastify.get('/:customer_code/list', list);
};