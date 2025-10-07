import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/api/auth';

export default function ProfilePage() {
    const { user, login } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        newPassword: '',
        newphone: user?.phone || '',
    })
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === 'newphone' ? Number(value) : value,

        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        if (!token) {
            setMessage('Error: Sesi berakhir. Silakan login kembali.');
            setIsSubmitting(false);
            return;
        }

        const updateData: any = {};
        if (formData.newPassword) updateData.password = formData.newPassword;
        if (formData.newphone) updateData.phone = formData.newphone;

        if (Object.keys(updateData).length === 0) {
            setMessage('Tidak ada perubahan.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await updateProfile(updateData, token);
            setMessage('Profil berhasil diperbarui! 🎉');

            if (response.user) {
                login(token, { ...user, ...response.user });
            }
            setFormData({
                name: '',
                email: '',
                newPassword: '',
                newphone: ''
            });

        } catch (error: any) {
            console.error('Update Profile Error:', error);
            setMessage(error.response?.data?.message || 'Gagal memperbarui profil. Coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Ubah Profil Saya</h1>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Informasi Akun</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name='name'
                                    placeholder="Masukkan nama Anda"
                                    value={formData.name}
                                    disabled
                                    onChange={handleChange}
                                    required
                                    className='bg-gray-300 cursor-not-allowed'
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name='email'
                                    placeholder="Masukkan email baru"
                                    value={formData.email}
                                    disabled
                                    onChange={handleChange}
                                    className='bg-gray-300 cursor-not-allowed'
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Kontak Baru</Label>
                                <Input
                                    id="phone"
                                    type="number"
                                    name='phone'
                                    placeholder="Masukan nomor kontak baru"
                                    value={formData.newphone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password Baru</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name='password'
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            {message && (
                                <p className={`text-sm font-medium ${message.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>
                                    {message}
                                </p>
                            )}

                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button type="submit" disabled={isSubmitting} className="w-full my-6 bg-green-600 hover:bg-green-500">
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
}