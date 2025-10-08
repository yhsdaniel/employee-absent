import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpService } from '@nestjs/axios';

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3001'

@Controller('auth')
export class AuthController {
    constructor(private readonly httpService: HttpService) { }

    @Post('register')
    async register(@Body() body: any) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    `${USER_SERVICE}/auth/register`, body
                ),
            );
            return { message: 'Registrasi karyawan berhasil!', data: response.data };
        } catch (error: any) {
            if (error.response?.status === 409 || error.response?.data?.code === 11000) {
                throw new HttpException('Email sudah terdaftar.', HttpStatus.CONFLICT);
            }
            throw new HttpException(
                error.response?.data?.message || 'Gagal registrasi.',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('login')
    async login(@Body() body: any) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${USER_SERVICE}/auth/login`, body),
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(
                error.response?.data?.message || 'Email atau kata sandi salah.',
                error.response?.status || HttpStatus.UNAUTHORIZED,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    async updateProfile(@Request() req: any, @Body() body: any) {
        const {userId} = req.user.sub;

        try {
            const response = await firstValueFrom(
                this.httpService.patch(
                    `${USER_SERVICE}/auth/profile/${userId}`,
                    body,
                    {
                        headers: { Authorization: `Bearer ${req.headers.authorization?.split(' ')[1]}` },
                    },
                ),
            );

            return {
                message: 'Profil berhasil diperbarui.',
                user: response.data,
            };
        } catch (error: any) {
            throw new HttpException(
                error.response?.data?.message || 'Gagal memperbarui profil.',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}