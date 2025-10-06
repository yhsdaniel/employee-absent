import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';

@Controller()
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    // Karyawan: Check-in
    @MessagePattern({ cmd: 'check_in' })
    async checkIn(data: { userId: string }) {
        return this.attendanceService.recordAttendance(data.userId, 'IN');
    }

    // Karyawan: Check-out
    @MessagePattern({ cmd: 'check_out' })
    async checkOut(data: { userId: string }) {
        return this.attendanceService.recordAttendance(data.userId, 'OUT');
    }

    @MessagePattern({ cmd: 'get_today_status' })
    async getTodayStatus(data: { userId: string }) {
        return this.attendanceService.getTodayStatus(data.userId);
    }

    @MessagePattern({ cmd: 'get_all_attendance_records' })
    async getAllRecords(data: { role: string }) {
        if (data.role !== 'HR') {
            return { error: 'Access denied' };
        }
        return this.attendanceService.findAllRecords();
    }
}