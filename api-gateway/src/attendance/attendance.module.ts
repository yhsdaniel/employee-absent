import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
    imports: [HttpModule],
    controllers: [AttendanceController],
    providers: [JwtAuthGuard]
})
export class AttendanceModule {}
