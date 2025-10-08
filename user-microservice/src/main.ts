import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  const port = process.env.PORT || 3001
  await app.listen(port);
  console.log(`User Service berjalan di port ${port}`);
}
bootstrap();