import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
    @Prop({
        type: Types.ObjectId,
        required: true,
    })
    userId: Types.ObjectId;

    @Prop({
        enum: ['IN', 'OUT'],
        required: true,
    })
    type: string;

    @Prop({
        required: true,
        default: Date.now,
    })
    timestamp: Date;

    @Prop({ nullable: true })
    notes: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);