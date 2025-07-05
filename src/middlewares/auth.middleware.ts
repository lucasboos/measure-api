import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import env from '../config/env';

declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');

    request.user = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
};