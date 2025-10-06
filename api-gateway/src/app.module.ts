import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AttendanceController } from './attendance/attendance.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 }, // Port User-Service
      },
      {
        name: 'ATTENDANCE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 }, // Port Attendance-Service
      },
    ]),
  ],
  controllers: [AuthController, AttendanceController],
  providers: [],
})
export class AppModule { }