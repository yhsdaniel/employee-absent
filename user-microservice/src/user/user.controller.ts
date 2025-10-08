import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() body: any) {
        try {
            const user = await this.userService.register(
                body.email,
                body.password,
                body.name,
                body.phone,
                body.position,
                body.role,
            );
            console.log(user)
            return { message: 'Registrasi berhasil!', user };
        } catch (error: any) {
            if (error.code === 11000) {
                throw new HttpException('Email sudah terdaftar.', HttpStatus.CONFLICT);
            }
            throw new HttpException(
                error.message || 'Gagal registrasi.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.userService.validateUser(body.email, body.password);
        if (!user) {
            throw new HttpException('Email atau kata sandi salah.', HttpStatus.UNAUTHORIZED);
        }

        const token = await this.userService.generateToken(user);
        return { accessToken: token };
    }

    @Post('validate-token')
    async validateToken(@Body() body: { token: string }) {
        if (!body.token) {
            throw new HttpException('Token tidak boleh kosong.', HttpStatus.BAD_REQUEST);
        }

        const payload = await this.userService.verifyToken(body.token);
        if (!payload) {
            throw new HttpException('Token tidak valid atau sudah kedaluwarsa.', HttpStatus.UNAUTHORIZED);
        }

        return payload;
    }


    @Patch('profile/:id')
    async updateProfile(@Param('id') userId: string, @Body() body: any) {
        try {
            const updatedUser = await this.userService.updateProfile(userId, body);
            return { message: 'Profil berhasil diperbarui.', user: updatedUser };
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Gagal memperbarui profil.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}