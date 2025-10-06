import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    name: string;

    @Prop({
        enum: ['EMPLOYEE', 'HR'],
        default: 'EMPLOYEE',
        required: true
    })
    role: string

    @Prop({ nullable: true })
    phone: number
}

export const UserSchema = SchemaFactory.createForClass(User);
