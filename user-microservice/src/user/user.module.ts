import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://gaaradanil:gaaradanil09@absence.qrs5aoa.mongodb.net/?retryWrites=true&w=majority&appName=absence'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

        JwtModule.register({
            secret: 'SUPER_SECRET_KEY_FOR_USER_SERVICE',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }