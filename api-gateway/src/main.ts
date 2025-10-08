import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const defaultOrigins = [
    'http://localhost:5173',
    'https://employee-absent.vercel.app'
  ];

  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : defaultOrigins;

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  })
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  await app.init();
  // await app.listen(process.env.PORT ?? 4000);
  // console.log('API gateway starting on http://localhost:4000')
}
bootstrap();