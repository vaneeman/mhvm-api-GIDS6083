import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export const mysqlProvider = {
  provide: 'MYSQL_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return connection;
  },
};