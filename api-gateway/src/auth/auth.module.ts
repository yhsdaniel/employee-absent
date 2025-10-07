import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [HttpModule],
    controllers: [AuthController],
    providers: [JwtAuthGuard]
})
export class AuthModule {}
