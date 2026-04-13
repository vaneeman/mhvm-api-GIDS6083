import { createConnection } from 'mysql2/promise';

export const mysqlProvider = {
  provide: 'MYSQL_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'edmApi',
    });
    return connection;
  },
};
