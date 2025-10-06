import { Controller, Post, Body, Inject, UseGuards, Get, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

    @Post('register')
    async register(@Body() body: any) {
        const result = await firstValueFrom(
            this.userClient.send({ cmd: 'register_employee' }, { ...body, role: 'EMPLOYEE' })
        );
        if (result && result.code === 11000) {
            throw new HttpException('Email sudah terdaftar.', HttpStatus.CONFLICT);
        }
        return { message: 'Registrasi karyawan berhasil!' };
    }

    @Post('login')
    async login(@Body() body: any) {
        const result = await firstValueFrom(
            this.userClient.send({ cmd: 'login' }, body)
        );
        if (!result || result.error) {
            throw new HttpException('Email atau kata sandi salah.', HttpStatus.UNAUTHORIZED);
        }
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    async updateProfile(@Request() req: any, @Body() body: any) {
        const userId = req.user.sub;

        const result = await firstValueFrom(
            this.userClient.send({ cmd: 'update_profile' }, { userId, ...body })
        );

        return { message: 'Profil berhasil diperbarui.', user: result };
    }
}