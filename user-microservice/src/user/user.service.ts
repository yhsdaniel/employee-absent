import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password_plain: string, name: string, phone: string, position: string, role: string): Promise<UserDocument | { code: number, message: string }> {
        try {
            const hashedPassword = await bcrypt.hash(password_plain, 10);
            const newUser = new this.userModel({
                email,
                password: hashedPassword,
                role,
                name,
                phone,
                position
            });
            return newUser.save();
        } catch (error) {
            console.log('Registration Error: ', error.message)
            if (error.code === 11000) {
                return { code: 11000, message: 'Email already exist.' };
            }

            if (error.name === 'ValidationError') {
                return { code: 400, message: `Validation data is failure: ${error.message}` };
            }

            return { code: 500, message: 'Registration failed.' };
        }
    }

    async login(email: string, password_plain: string): Promise<{ accessToken: string } | null> {
        const user = await this.userModel.findOne({ email }).exec();

        if (user && (await bcrypt.compare(password_plain, user.password))) {
            const payload = {
                email: user.email,
                sub: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role
            };
            return {
                accessToken: this.jwtService.sign(payload),
            };
        }
        return null;
    }

    async validateUser(email: string, password_plain: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email }).exec()

        if (user && (await bcrypt.compare(password_plain, user.password))) {
            return user
        }
        return null
    }

    async verifyToken(token: string): Promise<any | null> {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return null;
        }
    }

    async generateToken(user: UserDocument): Promise<string> {
        const payload = {
            email: user.email,
            sub: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role
        };
        return this.jwtService.sign(payload);
    }

    async updateProfile(userId: string, updateData: { email?: string, name?: string, password?: string, phone?: number }): Promise<UserDocument | null> {
        try {
            const updateField: any = {}
            if(updateData.password){
                const hashedPassword = await bcrypt.hash(updateData.password, 10);
                updateField.password = hashedPassword
                updateField.phone
            }
            return this.userModel.findByIdAndUpdate(
                userId,
                { $set: updateField },
                { new: true }
            ).exec();
        } catch (error) {
            console.log(error)
            throw new Error('Error update profile')
        }
    }

    async findAllEmployees(): Promise<UserDocument[]> {
        return this.userModel.find({}, { password: 0 }).exec();
    }
}