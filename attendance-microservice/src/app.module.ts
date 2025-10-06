import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [AttendanceModule],
  // controllers: [AppController, AttendanceController],
  // providers: [AppService, AttendanceService],
})
export class AppModule {}
