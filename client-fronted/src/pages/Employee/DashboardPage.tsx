import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { api } from '@/api/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const [status, setStatus] = useState<'IN' | 'OUT' | null>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleAttendance = async (type: 'checkin' | 'checkout') => {
        try {
            const endpoint = `/attendance/${type}`;
            const response = await api.post(endpoint, {});
            console.log(response)
            setMessage(response.data.message);
            setStatus(type === 'checkin' ? 'IN' : 'OUT');
        } catch (error: any) {
            setMessage(error.response?.data?.message || `Gagal ${type}.`);
        }
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await api.get('/attendance/status');
                setStatus(response.data.status);
            } catch (error) {
                console.error('Failed attendance:', error);
                setMessage('Failed attendance');
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    useEffect(() => {
        if (!isLoading && user === null) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    return (
        <Layout>
            <div className="p-8">
                <h1 className="text-xl font-bold mb-6">Halo, {user?.name}!</h1>

                <Card className="w-full max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">Absensi Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <p className={`text-lg font-semibold ${status === 'IN' ? 'text-green-600' : status === 'OUT' ? 'text-red-600' : 'text-gray-500'}`}>
                            Status: {status ? `Sudah ${status === 'IN' ? 'Check-in' : 'Check-out'}` : 'Belum Check-in'}
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
            </div>
        </Layout>
    );
}