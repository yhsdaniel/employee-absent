// attendance-service/src/attendance/attendance.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from '../schemas/attendance.schema';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    ) { }

    async recordAttendance(userId: string, type: 'IN' | 'OUT'): Promise<AttendanceDocument | { error: string }> {
        try {
            const objectIdUserId = new Types.ObjectId(userId)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastRecord = await this.attendanceModel
                .findOne({
                    userId: objectIdUserId,
                    timestamp: { $gte: today }
                })
                .sort({ timestamp: -1 })
                .exec();

            // Logika Check-in
            if (type === 'IN') {
                if (lastRecord && lastRecord.type === 'IN') {
                    return { error: 'Anda sudah Check-in hari ini.' };
                }
            }
            // Logika Check-out
            else if (type === 'OUT') {
                if (!lastRecord || lastRecord.type === 'OUT') {
                    return { error: 'Anda belum Check-in hari ini atau sudah Check-out.' };
                }
            }

            const newRecord = new this.attendanceModel({
                userId: objectIdUserId,
                type,
                timestamp: new Date()
            });
            return newRecord.save();
        } catch (error) {
            console.error('Attendance error: ', error)
            return { error: 'Terjadi kesalahan saat memproses absensi.' };
        }
    }

    async getTodayStatus(userId: string): Promise<{ status: 'IN' | 'OUT' | null }> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastRecord = await this.attendanceModel
                .findOne({
                    userId: new Types.ObjectId(userId), // Konversi ke ObjectId
                    timestamp: { $gte: today }
                })
                .sort({ timestamp: -1 })
                .exec();
            
            let status: 'IN' | 'OUT' | null = null;
            if (lastRecord) {
                status = lastRecord.type as 'IN' | 'OUT';
            }
            return { status };

        } catch (error) {
            console.error('Error getting today status:', error);
            // Kembalikan status null jika terjadi error database
            return { status: null };
        }
    }

    async findAllRecords(): Promise<AttendanceDocument[]> {
        return this.attendanceModel.find().sort({ timestamp: -1 }).exec();
    }
}