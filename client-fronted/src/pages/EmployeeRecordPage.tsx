import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/api/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AttendanceRecord {
    _id: string;
    userId: string;
    name: string;
    type: 'IN' | 'OUT';
    timestamp: string;
}

export default function EmployeeRecordPage() {
    const [nameQuery, setNameQuery] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const fetchRecords = async () => {
        setIsLoading(true);
        if (!startDate || !endDate) {
            setMessage('Harap pilih tanggal awal dan akhir.');
            setIsLoading(false);
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('startDate', startDate);
            params.append('endDate', endDate);
            if (nameQuery) {
                params.append('name', nameQuery);
            }

            const response = await api.get(`/attendance/hr/records?${params.toString()}`);

            setRecords(Array.isArray(response.data) ? response.data : []);
            setMessage(`Menampilkan ${Array.isArray(response.data) ? response.data.length : 0} record.`);

        } catch (error: any) {
            console.error('Error fetching HR records:', error);
            setMessage(error?.response?.data?.message || 'Gagal mengambil data.');
            setRecords([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="p-2 max-w-6xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Riwayat Absensi Karyawan (HR)</h2>

                <Card className="mb-6">
                    <CardHeader><CardTitle className="text-lg">Filter Data</CardTitle></CardHeader>
                    <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-end">
                        <div className="space-y-2 w-full md:w-1/3">
                            <Label htmlFor="nameQuery">Nama Karyawan</Label>
                            <Input
                                id="nameQuery"
                                type="text"
                                placeholder="Cari berdasarkan nama..."
                                value={nameQuery}
                                onChange={(e) => setNameQuery(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 w-full md:w-auto">
                            <Label htmlFor="startDate">Dari Tanggal</Label>
                            <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2 w-full md:w-auto">
                            <Label htmlFor="endDate">Sampai Tanggal</Label>
                            <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <Button onClick={fetchRecords} disabled={isLoading} className="w-full md:w-auto">
                            {isLoading ? 'Mencari...' : 'Cari'}
                        </Button>
                    </CardContent>
                </Card>

                {message && (
                    <div className="mb-4 text-sm text-gray-700">{message}</div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Data Absensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Karyawan</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.length === 0 && !isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">
                                                Tidak ada data absensi yang ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        records.map((record) => (
                                            <TableRow key={record._id} className='text-left'>
                                                <TableCell className="font-semibold">{record.name}</TableCell>
                                                <TableCell>{formatDate(record.timestamp)}</TableCell>
                                                <TableCell>{formatTime(record.timestamp)}</TableCell>
                                                <TableCell className={`font-semibold ${record.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.type}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}