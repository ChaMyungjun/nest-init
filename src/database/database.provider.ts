import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        database: 'test',
        entities: ['src/entity/*.ts', './build/src/entity/*.js'],
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  },
];
