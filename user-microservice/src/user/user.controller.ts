import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @MessagePattern({ cmd: 'register_employee' })
    async register(data: any) {
        return this.userService.register(data.email, data.password, data.name, data.role);
    }

    @MessagePattern({ cmd: 'login' })
    async login(data: any) {
        const user = await this.userService.validateUser(data.email, data.password);
        if (!user) return { error: 'Invalid credentials' };

        const token = await this.userService.generateToken(user);
        return { accessToken: token };
    }

    @MessagePattern({ cmd: 'validate_token' })
    async validateToken(data: { token: string }) {
        if (!data.token) {
            return { error: 'Token is missing' };
        }

        // Panggil fungsi service untuk memverifikasi token
        const payload = await this.userService.verifyToken(data.token);

        if (!payload) {
            // Mengembalikan objek error yang akan ditangani oleh JwtAuthGuard di Gateway
            return { error: 'Invalid or expired token' };
        }

        // Mengembalikan payload yang berisi { sub, email, role }
        return payload;
    }

    @MessagePattern({ cmd: 'update_profile' })
    async updateProfile(data: { userId: string, name: string, email: string, password: string }) {
        return this.userService.updateProfile(data.userId, data);
    }
}