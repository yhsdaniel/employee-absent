import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' })
  await app.listen(process.env.PORT ?? 4000);
  console.log('API gateway starting on http://localhost:4000')
}
bootstrap();