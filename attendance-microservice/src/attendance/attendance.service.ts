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

    async recordAttendance(userId: string, name: string, type: 'IN' | 'OUT'): Promise<AttendanceDocument | { error: string }> {
        try {
            const objectIdUserId = new Types.ObjectId(userId)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastRecord = await this.attendanceModel
                .findOne({
                    userId: objectIdUserId,
                    name,
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
                name,
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
                    userId: new Types.ObjectId(userId),
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
            return { status: null };
        }
    }

    async getMonthlyRecords(userId: string): Promise<AttendanceDocument[] | any> {
        try {
            const objectIdUserId = new Types.ObjectId(userId);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const records = await this.attendanceModel
                .find({
                    userId: objectIdUserId,
                    timestamp: { $gte: startOfMonth }
                })
                .sort({ timestamp: -1 }) // Urutkan dari yang terbaru
                .exec();

            return records;

        } catch (error) {
            console.error('Error fetching monthly records:', error);
            return { error: 'Gagal mengambil riwayat absensi.' };
        }
    }

    async getAllRecordsByDate(startDate: string, endDate: string, name: string): Promise<any[] | { error: string }> {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            end.setHours(23, 59, 59, 999);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return { error: 'Format tanggal tidak valid.' };
            }

            const records = await this.attendanceModel
                .find({
                    timestamp: {
                        $gte: start,
                        $lte: end
                    },
                    name
                })
                .sort({ timestamp: -1 })
                .exec();

            console.log(name)
            
            return records;
        } catch (error) {
            console.error('Error fetching all records by date:', error);
            return { error: 'Gagal mengambil data riwayat absensi.' };
        }
    }

    async findAllRecords(): Promise<AttendanceDocument[]> {
        return this.attendanceModel.find().sort({ timestamp: -1 }).exec();
    }
}