import { Controller, Post, Get, Inject, UseGuards, Request, Body, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';

const ATTENDANCE_SERVICE = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3002'

@Controller('attendance')
export class AttendanceController {
    // constructor(@Inject('ATTENDANCE_SERVICE') private readonly attendanceClient: ClientProxy) { }
    constructor(private readonly httpService: HttpService) { }

    @UseGuards(JwtAuthGuard)
    @Post('checkin')
    async checkIn(@Request() req: any) {
        const { sub: userId, name } = req.user;

        try {
            const response = await firstValueFrom(
                this.httpService.post(`${ATTENDANCE_SERVICE}/attendance/checkin`, { userId, name })
            );
            return { message: 'Check-in berhasil', record: response.data };
        } catch (error: any) {
            throw new HttpException(error.response?.data?.message || 'Gagal check-in', error.response?.status || HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    async checkOut(@Request() req: any) {
        const { sub: userId, name } = req.user;

        try {
            const response = await firstValueFrom(
                this.httpService.post(`${ATTENDANCE_SERVICE}/attendance/checkout`, { userId, name })
            );
            return { message: 'Check-out berhasil', record: response.data };
        } catch (error: any) {
            throw new HttpException(error.response?.data?.message || 'Gagal check-out', error.response?.status || HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('status')
    async getTodayStatus(@Request() req: any) {
        const { sub: userId } = req.user;

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${ATTENDANCE_SERVICE}/attendance/status`, { params: { userId } })
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(error.response?.data?.message || 'Gagal mengambil status', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('records')
    async getAttendanceRecords(@Request() req: any) {
        const { role } = req.user;

        if (role !== 'HR') {
            throw new HttpException('Akses ditolak. Hanya untuk HR.', HttpStatus.FORBIDDEN);
        }

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${ATTENDANCE_SERVICE}/attendance/records`, { params: { role } })
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(error.response?.data?.message || 'Gagal mengambil records', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${ATTENDANCE_SERVICE}/attendance/hr/records`, {
                    params: { startDate, endDate, nameQuery }
                })
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(error.response?.data?.message || 'Gagal mengambil records', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('records/monthly')
    async getMonthlyRecords(@Request() req: any) {
        const { sub: userId } = req.user;

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${ATTENDANCE_SERVICE}/attendance/records/monthly`, { params: { userId } })
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(error.response?.data?.message || 'Gagal mengambil records bulanan', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}