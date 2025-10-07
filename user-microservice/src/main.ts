import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.TCP,
  //   options: { host: 'localhost', port: 3001 },
  // });
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || 3001
  await app.listen(port);
  console.log(`User Service berjalan di port ${port}`);
}
bootstrap();