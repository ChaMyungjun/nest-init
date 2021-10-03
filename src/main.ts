import { NestFactory } from '@nestjs/core';

//module
import { AppModule } from './app.module';

//utils
import {setupSwagger} from "src/utils/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app) 
  await app.listen(3001);
}
bootstrap();
