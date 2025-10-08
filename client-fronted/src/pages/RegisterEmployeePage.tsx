import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerEmployee } from '@/api/auth';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

type FormDataTypes = {
    name: string,
    email: string,
    password: string,
    phone: number,
    position: string,
    role: 'EMPLOYEE' | 'HR'
}

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState<FormDataTypes>({
        name: '',
        email: '',
        password: '',
        phone: 0,
        position: '',
        role: 'EMPLOYEE'
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'phone' ? Number(value) : value,
        });
    };

    const handleRoleChange = (newRoleValue: 'EMPLOYEE' | 'HR') => {
        setFormData(prevData => ({
            ...prevData,
            role: newRoleValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!token) {
            toast.error('Error: Sesi berakhir. Silakan login kembali.')
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await registerEmployee(formData);

            if (response.user) {
                login(token, { ...user, ...response.user });
            }
            toast.success('Karyawan baru berhasil ditambah! 🎉')
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: 0,
                position: '',
                role: 'EMPLOYEE'
            });
        } catch (error: any) {
            console.error('Update Profile Error:', error);
            toast.error(error.response?.data?.message || 'Gagal memperbarui profil. Coba lagi.')
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="p-2 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Register Karyawan Baru</h2>

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
                                    onChange={handleChange}
                                    required
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
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name='password'
                                    placeholder="Masukkan password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="number"
                                    name='phone'
                                    placeholder="Masukkan phone number karyawan"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">Posisi</Label>
                                <Input
                                    id="position"
                                    type="text"
                                    name='position'
                                    placeholder="Masukkan posisi karyawan"
                                    value={formData.position}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select name='role' value={formData.role} onValueChange={handleRoleChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Role</SelectLabel>
                                            <SelectItem value="EMPLOYEE">Karyawan</SelectItem>
                                            <SelectItem value="HR">HR</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

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