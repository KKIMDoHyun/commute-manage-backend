import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  await app.listen(port);
}
bootstrap();
