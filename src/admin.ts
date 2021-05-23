import AdminBro from 'admin-bro';
import * as AdminBroExpress from '@admin-bro/express';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function runAdmin() {
  // Nest.js App 생성
  const app = await NestFactory.create(AppModule);

  // AdminBro router 생성
  const adminBro = new AdminBro({
    rootPath: '/admin',
  });
  const router = AdminBroExpress.default.buildRouter(adminBro);

  // Nest.js AdminBro 연결
  app.use(adminBro.options.rootPath, router);

  // App 실행
  await app.listen(3000);
  console.log('Nest.js AdminBro is running on 3000');
}

runAdmin();
