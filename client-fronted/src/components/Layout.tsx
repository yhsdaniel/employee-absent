import React, { type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
        return null;
    }

    const navItems = user.role === 'HR'
        ? [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Lihat Record Karyawan', path: '/hr/employees' },
            { name: 'Ubah Profil', path: '/profile' },
        ]
        : [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Ubah Profil', path: '/profile' },
        ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar (Navigation) */}
            <aside className="w-64 bg-white shadow-xl flex flex-col p-4">
                <div className="text-2xl font-extrabold text-blue-600 mb-8 p-2 border-b">
                    Absensi App
                </div>

                <nav className="flex-grow space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.path} to={item.path}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </nav>

                {/* Footer/User Dropdown */}
                <div className="mt-auto pt-4 border-t">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="default"
                                className="w-full justify-start font-medium h-12"
                            >
                                <span className="mr-2 text-xl">👤</span>
                                {user.name}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                {user.role === 'HR' ? 'Admin HR' : 'Karyawan'}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/profile">Ubah Profil</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;