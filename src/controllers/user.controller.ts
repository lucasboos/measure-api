import { FastifyRequest, FastifyReply } from 'fastify';
import { registerUser, loginUser, deleteUser } from '../services/user.service';
import { IUserPayload } from '../types/user';

export const signUp = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = req.body as IUserPayload;

    if (!email || !password) {
      return reply.status(400).send({ message: "Email and password are required." });
    }

    const user = await registerUser(email, password);
    reply.status(201).send(user);
  } catch (err: any) {
    reply.status(err.status || 500).send({ message: err.message || 'Error registering user.' });
  }
};

export const signIn = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = req.body as IUserPayload;
    const token = await loginUser(email, password);
    reply.send({ token });
  } catch (err: any) {
    reply.status(err.status || 500).send({ message: err.message || 'Invalid credentials.' });
  }
};

export const removeUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.user as { id: string };
    await deleteUser(id);
    reply.send({ message: 'User deleted.' });
  } catch (err: any) {
    reply.status(err.status || 500).send({ message: err.message || 'Error deleting user.' });
  }
};