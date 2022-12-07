import 'reflect-metadata';
import { DataSource } from 'typeorm';
import entity from './api/entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '52.78.135.227',
  port: 3306,
  username: 'admin',
  password: 'bangoo321!',
  database: 'devteam_study',
  synchronize: true,
  logging: true,
  entities: entity,
  migrations: [],
  subscribers: [],
});
