import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            navigate('/dashboard')
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const { accessToken } = await loginUser({ email, password });
            const decodeToken = jwtDecode(accessToken)

            login(accessToken, decodeToken);
            navigate('/dashboard');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-[380px] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Absensi Karyawan</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full my-6">
                            Login
                        </Button>
                        {/* <p className="mt-4 text-sm text-center text-gray-500">
                            Belum punya akun? <a href="/register" className="text-blue-600 hover:underline">Daftar</a>
                        </p> */}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}