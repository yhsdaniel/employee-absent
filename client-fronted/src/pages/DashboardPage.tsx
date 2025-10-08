import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { api } from '@/api/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AttendanceRecord {
    _id: string;
    type: 'IN' | 'OUT';
    timestamp: string;
}

export default function DashboardPage() {
    const [status, setStatus] = useState<'IN' | 'OUT' | null>(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const statusResponse = await api.get('/attendance/status');
            setStatus(statusResponse.data.status);

            const recordsResponse = await api.get('/attendance/records/monthly');
            setRecords(recordsResponse.data);

        } catch (error) {
            console.error('Gagal memuat data:', error);
            setMessage('Gagal memuat data absensi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleAttendance = async (type: 'checkin' | 'checkout') => {
        setMessage('');
        try {
            const endpoint = `/attendance/${type}`;
            const response = await api.post(endpoint, {});

            setMessage(response.data.message);
            setStatus(type === 'checkin' ? 'IN' : 'OUT');

            fetchData();

        } catch (error: any) {
            setMessage(error.response?.data?.message || `Gagal ${type}.`);
        }
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };


    if (isLoading) {
        return <Layout><div className="p-8">Memuat data absensi...</div></Layout>;
    }

    return (
        <Layout>
            <div className="p-2">
                <h2 className="text-xl font-bold mb-6">Dashboard Karyawan</h2>

                <Card className="w-full max-w-lg mx-auto mb-8">
                    <CardHeader>
                        <CardTitle className="text-center">Absensi Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <p className={`text-lg font-semibold ${status === 'IN' ? 'text-green-600' : status === 'OUT' ? 'text-red-600' : 'text-gray-500'}`}>
                            Status: {status === 'IN' ? 'Check-in' : status === 'OUT' ? 'Check-out' : 'Belum Absen'}
                        </p>

                        <div className="flex space-x-4">
                            <Button
                                onClick={() => handleAttendance('checkin')}
                                disabled={status === 'IN' || status === 'OUT'}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Check-in
                            </Button>
                            <Button
                                onClick={() => handleAttendance('checkout')}
                                disabled={!status || status === 'OUT'}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Check-out
                            </Button>
                        </div>
                        {message && <p className="text-sm pt-2">{message}</p>}
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Riwayat Absensi Bulan Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {records.length === 0 ? (
                            <p className="text-center text-gray-500">Belum ada riwayat absensi bulan ini.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>Tipe</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {records.map((record) => (
                                            <TableRow key={record._id} className='text-left'>
                                                <TableCell className="font-medium">{formatDate(record.timestamp)}</TableCell>
                                                <TableCell>{formatTime(record.timestamp)}</TableCell>
                                                <TableCell className={`font-semibold ${record.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.type}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </Layout>
    );
}