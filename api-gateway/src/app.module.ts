import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    AttendanceModule,
    ConfigModule.forRoot({ isGlobal: true })
  ]
})
export class AppModule { }