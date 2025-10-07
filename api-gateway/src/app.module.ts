import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AttendanceController } from './attendance/attendance.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'USER_SERVICE',
    //     transport: Transport.TCP,
    //     options: { host: 'localhost', port: 3001 }, // Port User-Service
    //   },
    //   {
    //     name: 'ATTENDANCE_SERVICE',
    //     transport: Transport.TCP,
    //     options: { host: 'localhost', port: 3002 }, // Port Attendance-Service
    //   },
    // ]),
    AuthModule,
    AttendanceModule,
    ConfigModule.forRoot({ isGlobal: true })
  ]
})
export class AppModule { }