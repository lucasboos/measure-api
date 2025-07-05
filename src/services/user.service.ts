import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/hash';
import jwt from 'jsonwebtoken';
import env from '../config/env';

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (email: string, password: string) => {
  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) throw { status: 409, message: 'User already exists' };
  const hashedPassword = await hashPassword(password);
  const user = userRepository.create({ email, password: hashedPassword });
  await userRepository.save(user); 
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findOneBy({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    throw { status: 401, message: 'Invalid credentials' };
  }
  return jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '30d' });
};

export const deleteUser = async (id: string) => {
  const user = await userRepository.findOneBy({ id });
  if (!user) throw { status: 404, message: 'User not found' };
  await userRepository.delete(id);
};