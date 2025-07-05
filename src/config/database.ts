import { DataSource } from 'typeorm';
import env from './env';
import { User } from '../entities/User';
import { Measure } from '../entities/Measure';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  entities: [User, Measure],
  synchronize: true,
});
