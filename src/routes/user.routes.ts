import { FastifyInstance } from 'fastify';
import { signUp, signIn, removeUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export default async (fastify: FastifyInstance) => {
  fastify.post('/signup', signUp);
  fastify.post('/login', signIn);
  fastify.delete('/delete', { preHandler: authMiddleware }, removeUser);
};