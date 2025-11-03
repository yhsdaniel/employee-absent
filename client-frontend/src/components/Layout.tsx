import React, { useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, LogOut, LayoutDashboard, UserCircle, ScrollText, UserPlus, Briefcase, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

interface LayoutProps {
    children: ReactNode;
}

interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.body.style.pointerEvents = 'auto';
    }, [location]);

    if (!user) {
        navigate('/');
        return null;
    }

    const navItems: NavItem[] = user.role === 'HR'
        ? [
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { name: 'Lihat Record Karyawan', path: '/hr/record-employees', icon: ScrollText },
            { name: 'Tambah Karyawan', path: '/hr/register-employees', icon: UserPlus },
        ]
        : [
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    const SidebarContent: React.FC = () => (
        <div className="flex flex-col h-full p-4">
            <div className="text-2xl font-bold text-blue-600 mb-8 p-2 border-b">
                Absensi App
            </div>

            <nav className="flex-grow space-y-2">
                {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link key={item.path} to={item.path}>
                            <Button
                                variant={active ? 'default' : 'ghost'}
                                className={`
                                    w-full justify-start text-base h-11 transition-colors rounded-xl
                                    ${active
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                    }
                                `}
                            >
                                <IconComponent className="mr-3 h-5 w-5" />
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            className="w-full justify-start font-semibold h-12 text-base text-gray-800 rounded-xl"
                        >
                            <UserCircle className="mr-3 h-6 w-6 text-blue-600" />
                            {user.name}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[15.5rem]" align="start">
                        <DropdownMenuLabel className="font-bold text-gray-800 flex items-center">
                            <Briefcase className="mr-2 h-4 w-4 opacity-70" />
                            {user.role === 'HR' ? 'Admin HR' : 'Karyawan'}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/profile" className="flex items-center cursor-pointer">
                                <Settings className="mr-2 h-4 w-4 opacity-70" />
                                Ubah Profil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 cursor-pointer flex items-center focus:text-red-600 focus:bg-red-50"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <aside className="hidden lg:flex w-64 bg-white shadow-2xl flex-col h-full">
                <SidebarContent />
            </aside>

            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="fixed top-4 left-4 z-50 bg-white shadow-xl rounded-full h-12 w-12 hover:bg-gray-100"
                        >
                            <Menu className="h-6 w-6 text-blue-600" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 pt-0 sm:w-80">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8">
                <div className="lg:hidden h-16"></div>
                {children}
            </main>
        </div>
    );
};

export default Layout;
