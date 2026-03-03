'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, LogOut, HelpCircle, Menu, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { sweetAlert } from '@/lib/sweetAlert';
import NotificationDropdown from '@/components/pelanggan/notifications/NotificationDropdown'; // Import Komponen Baru

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => { setImageError(false); }, [user?.foto_url]);

    const handleLogout = async () => {
        const result = await sweetAlert.confirmLogout();
        if (result.isConfirmed) {
            setMobileMenuOpen(false);
            await logout();
        }
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    const navLinks = [
        { label: 'Beranda', href: user ? '/pelanggan/home' : '/' },
        { label: 'Tentang', href: '/about' }, // Simplifikasi path
        { label: 'Booking', href: user ? '/pelanggan/booking/create' : '/login' },
        ...(user ? [{ label: 'Riwayat Booking', href: '/pelanggan/booking/riwayat' }] : []),
        { label: 'FAQ', href: '/pelanggan/faq', icon: 'help' },
    ];

    const isActive = (href: string) => {
        if (!pathname) return false;
        const cleanPathname = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

        if (href === '/' || href === '/pelanggan/home') {
            return cleanPathname === href;
        }
        return cleanPathname.startsWith(href);
    };

    return (
        <nav className="sticky top-4 z-50 mx-4 md:mx-12 mt-4 bg-[#1a1a1a] text-white py-3 px-6 md:px-8 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-md transition-all duration-300">
            <div className="flex justify-between items-center">
                <Link href={user ? "/pelanggan/home" : "/"} className="text-xl md:text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity">
                    MainDi<span className="text-[#D93F21]">Hatta</span>.id
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-1 transition-colors duration-200 relative pb-1
                                    ${active ? 'text-[#D93F21] font-bold' : 'text-gray-300 hover:text-white'}
                                `}
                            >
                                {link.icon === 'help' && <HelpCircle className={`w-4 h-4 ${active ? 'text-[#D93F21]' : ''}`} />}
                                {link.label}
                                {active && (
                                    <span className="absolute -bottom-4 left-0 right-0 h-1 bg-[#D93F21] rounded-t-full shadow-[0_0_10px_#D93F21]"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:block">
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm focus:outline-none border border-transparent focus:border-[#D93F21] w-32 focus:w-48 transition-all placeholder-gray-400"
                        />
                        <Search className="w-4 h-4 absolute right-3 top-2 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                                <Loader2 className="w-5 h-5 animate-spin text-[#D93F21]" />
                            </div>
                        ) : user ? (
                            <>
                                {/* NOTIFICATION DROPDOWN (DESKTOP) */}
                                <div className="hidden md:block">
                                    <NotificationDropdown />
                                </div>

                                <Link href="/profile" className="hidden md:block">
                                    <span className="text-sm text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 overflow-hidden">
                                            {user.foto_url && !imageError ? (
                                                <img
                                                    src={user.foto_url}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setImageError(true)}
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-300">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                </span>
                                            )}
                                        </div>
                                        <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                                    </span>
                                </Link>

                                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/10 hover:text-red-400 rounded-full hidden md:flex" title="Keluar">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 hidden md:flex">
                                <Link href="/login" className="text-sm text-white hover:text-[#D93F21] transition-colors font-medium">Masuk</Link>
                                <Link href="/register" className="px-5 py-2 bg-[#D93F21] hover:bg-[#b9351b] text-white text-sm rounded-full transition shadow-lg shadow-orange-900/20 font-medium">Daftar</Link>
                            </div>
                        )}

                        {/* MOBILE MENU TRIGGER */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 ml-1">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-[280px] bg-[#1a1a1a] text-white border-l border-gray-800/50 p-6">
                                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                                <div className="flex flex-col h-full mt-6">
                                    <Link href="/" onClick={closeMobileMenu} className="text-xl font-bold tracking-tight mb-8 block">
                                        MainDi<span className="text-[#D93F21]">Hatta</span>.id
                                    </Link>

                                    <nav className="flex flex-col gap-2 flex-1">
                                        {navLinks.map((link) => {
                                            const active = isActive(link.href);
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={closeMobileMenu}
                                                    className={`transition flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium
                                                        ${active
                                                            ? 'bg-[#D93F21]/10 text-[#D93F21] border-l-4 border-[#D93F21]'
                                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                        }
                                                    `}
                                                >
                                                    {link.icon === 'help' && <HelpCircle className="w-4 h-4" />}
                                                    {link.label}
                                                </Link>
                                            );
                                        })}


                                        {user && (
                                            <Link href="/pelanggan/notifications" onClick={closeMobileMenu} className="transition flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">
                                                <span>Notifikasi</span>
                                            </Link>
                                        )}
                                    </nav>

                                    <div className="border-t border-gray-800 pt-6 mt-4">
                                        {isLoading ? (
                                            <div className="flex justify-center py-2"><Loader2 className="animate-spin w-5 h-5 text-gray-500" /></div>
                                        ) : user ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 px-2">
                                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                                        {user.foto_url && !imageError ? (
                                                            <img
                                                                src={user.foto_url}
                                                                alt="avatar"
                                                                className="w-full h-full object-cover"
                                                                onError={() => setImageError(true)}
                                                            />
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-300">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{user.name}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
                                                    </div>
                                                </div>
                                                <Button variant="destructive" onClick={handleLogout} className="w-full justify-center bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20">
                                                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <Link href="/login" onClick={closeMobileMenu}><Button className="w-full bg-[#D93F21] hover:bg-[#b9351b] text-white">Masuk</Button></Link>
                                                <Link href="/register" onClick={closeMobileMenu}><Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-white/5 bg-transparent">Daftar</Button></Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}