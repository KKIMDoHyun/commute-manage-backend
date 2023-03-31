import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
