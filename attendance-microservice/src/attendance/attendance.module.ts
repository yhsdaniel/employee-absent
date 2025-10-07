import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance, AttendanceSchema } from '../schemas/attendance.schema';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://gaaradanil:gaaradanil09@absence.qrs5aoa.mongodb.net/?retryWrites=true&w=majority&appName=absence'), // Ganti URL ini
        MongooseModule.forFeature([{ name: Attendance.name, schema: AttendanceSchema }]),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule { }