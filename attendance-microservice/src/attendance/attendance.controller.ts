import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';

@Controller()
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @MessagePattern({ cmd: 'check_in' })
    async checkIn(data: { userId: string, name: string }) {
        return this.attendanceService.recordAttendance(data.userId, data.name, 'IN');
    }

    @MessagePattern({ cmd: 'check_out' })
    async checkOut(data: { userId: string, name: string }) {
        return this.attendanceService.recordAttendance(data.userId, data.name, 'OUT');
    }

    @MessagePattern({ cmd: 'get_today_status' })
    async getTodayStatus(data: { userId: string }) {
        return this.attendanceService.getTodayStatus(data.userId);
    }

    @MessagePattern({ cmd: 'get_monthly_records' })
    async getMonthlyRecords(data: { userId: string }) {
        return this.attendanceService.getMonthlyRecords(data.userId);
    }

    @MessagePattern({ cmd: 'get_all_records_by_date' })
    async getAllRecordsByDate(data: { startDate: string; endDate: string, nameQuery: string }) {
        return this.attendanceService.getAllRecordsByDate(data.startDate, data.endDate, data.nameQuery);
    }

    @MessagePattern({ cmd: 'get_all_attendance_records' })
    async getAllRecords(data: { role: string }) {
        if (data.role !== 'HR') {
            return { error: 'Access denied' };
        }
        return this.attendanceService.findAllRecords();
    }
}