import { Controller, Post, Get, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @Post('checkin')
    async checkIn(@Body() body: { userId: string; name: string }) {
        try {
            return await this.attendanceService.recordAttendance(body.userId, body.name, 'IN');
        } catch (error: any) {
            throw new HttpException(error.message || 'Check-in gagal', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('checkout')
    async checkOut(@Body() body: { userId: string; name: string }) {
        try {
            return await this.attendanceService.recordAttendance(body.userId, body.name, 'OUT');
        } catch (error: any) {
            throw new HttpException(error.message || 'Check-out gagal', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('status')
    async getTodayStatus(@Query('userId') userId: string) {
        if (!userId) throw new HttpException('userId wajib diisi', HttpStatus.BAD_REQUEST);
        return this.attendanceService.getTodayStatus(userId);
    }

    @Get('records/monthly')
    async getMonthlyRecords(@Query('userId') userId: string) {
        if (!userId) throw new HttpException('userId wajib diisi', HttpStatus.BAD_REQUEST);
        return this.attendanceService.getMonthlyRecords(userId);
    }

    @Get('hr/records')
    async getAllRecordsByDate(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('nameQuery') nameQuery?: string,
    ) {
        if (!startDate || !endDate) {
            throw new HttpException('Filter tanggal wajib diisi.', HttpStatus.BAD_REQUEST);
        }
        if(nameQuery){
            return this.attendanceService.getAllRecordsByDate(startDate, endDate, nameQuery);
        }
    }

    @Get('records')
    async getAllRecords(@Query('role') role: string) {
        if (role !== 'HR') {
            throw new HttpException('Akses ditolak. Hanya untuk HR.', HttpStatus.FORBIDDEN);
        }
        return this.attendanceService.findAllRecords();
    }
}