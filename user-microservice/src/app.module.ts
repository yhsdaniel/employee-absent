import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  // controllers: [AppController, UserController],
  // providers: [AppService, UserService],
})
export class AppModule {}
