import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');
  const port = serverConfig.port;

  await app.listen(3000);
}
bootstrap();
