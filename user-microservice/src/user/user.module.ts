import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            secret: 'SUPER_SECRET_KEY_FOR_USER_SERVICE',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }