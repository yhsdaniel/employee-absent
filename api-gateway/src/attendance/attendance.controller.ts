import { Controller, Post, Get, Inject, UseGuards, Request, Body, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendance')
export class AttendanceController {
    constructor(@Inject('ATTENDANCE_SERVICE') private readonly attendanceClient: ClientProxy) { }

    @UseGuards(JwtAuthGuard)
    @Post('checkin')
    async checkIn(@Request() req: any) {
        const { sub: userId, name: name } = req.user;

        const result = await firstValueFrom(
            this.attendanceClient.send({ cmd: 'check_in' }, { userId, name })
        );

        if (result && result.error) {
            throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
        }

        return {
            message: 'Check-in berhasil',
            record: result
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    async checkOut(@Request() req: any) {
        const { sub: userId, name: name } = req.user;

        const result = await firstValueFrom(
            this.attendanceClient.send({ cmd: 'check_out' }, { userId, name })
        );

        if (result && result.error) {
            throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
        }
        return {
            message: 'Check-out berhasil',
            record: result
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('status')
    async getTodayStatus(@Request() req: any) {
        const { sub: userId } = req.user;

        const result = await firstValueFrom(
            this.attendanceClient.send({ cmd: 'get_today_status' }, { userId })
        );
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('records')
    async getAttendanceRecords(@Request() req: any) {
        const { role } = req.user;

        if (role !== 'HR') {
            throw new HttpException('Akses ditolak. Hanya untuk HR.', HttpStatus.FORBIDDEN);
        }

        const records = await firstValueFrom(
            this.attendanceClient.send({ cmd: 'get_attendance_records' }, { role })
        );

        return records;
    }

    @UseGuards(JwtAuthGuard)
    @Get('hr/records')
    async getAllRecordsByDate(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('name') nameQuery?: string,
    ) {
        if (!startDate || !endDate) {
            throw new HttpException('Filter tanggal wajib diisi.', HttpStatus.BAD_REQUEST);
        }

        const result = await firstValueFrom(
            this.attendanceClient.send({ cmd: 'get_all_records_by_date' }, {
                startDate,
                endDate,
                nameQuery
            })
        );

        if (result && result.error) {
            throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('records/monthly')
    async getMonthlyRecords(@Request() req: any) {
        const { sub: userId } = req.user;

        const result = await firstValueFrom(
            this.attendanceClient.send({ cmd: 'get_monthly_records' }, { userId })
        );

        if (result && result.error) {
            throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result;
    }
}