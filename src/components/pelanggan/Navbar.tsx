'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '@/lib/axios'; // Pastikan pakai axios yang sudah config credential
import { Search, LogOut, Bell, HelpCircle, Menu, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth'; // Pastikan path hook benar
import { sweetAlert } from '@/lib/sweetAlert';

// Hook Notifikasi (Diperbaiki agar aman saat logout)
const useUnreadNotifications = (userId: number | string | undefined) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Jika tidak ada user ID (belum login/logout), reset ke 0 dan stop
        if (!userId) {
            setUnreadCount(0);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications/unread-count', {
                    params: { user_id: userId }
                });
                setUnreadCount(response.data.count || 0);
            } catch (error) {
                // Silent error (opsional: log ke console jika perlu debugging)
                // console.error("Gagal notifikasi", error);
            }
        };

        fetchNotifications();

        // Polling setiap 30 detik
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    return unreadCount;
};

export default function Navbar() {
    // 1. Ambil isLoading dari useAuth
    const { user, logout, isLoading } = useAuth(); 
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // 2. Fetch notifikasi hanya jika user ada
    const unreadCount = useUnreadNotifications(user?.id);

    const handleLogout = async () => {
        const result = await sweetAlert.confirmLogout();
        if (result.isConfirmed) {
            setMobileMenuOpen(false); // Tutup menu dulu
            await logout(); // useAuth akan handle redirect ke /login
        }
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    // 3. Logic Link Navigasi (Dibuat dinamis berdasarkan state user)
    // Gunakan useMemo jika link sangat kompleks, tapi array literal ini sudah cukup cepat
    const navLinks = [
        { label: 'Beranda', href: user ? '/pelanggan/home' : '/' },
        { label: 'Tentang', href: user ? '/pelanggan/about' : '/about' },
        { label: 'Booking', href: user ? '/pelanggan/booking/create' : '/login' },
        // Hanya tampilkan Riwayat jika user ada
        ...(user ? [{ label: 'Riwayat Booking', href: '/pelanggan/booking/riwayat' }] : []),
        { label: 'FAQ', href: '/pelanggan/faq', icon: 'help' },
    ];

    return (
        <nav className="sticky top-4 z-50 mx-4 md:mx-12 mt-4 bg-[#1a1a1a] text-white py-3 px-6 md:px-8 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-md transition-all duration-300">
            <div className="flex justify-between items-center">
                {/* LOGO */}
                <Link href={user ? "/pelanggan/home" : "/"} className="text-xl md:text-2xl font-bold tracking-tight">
                    MainDi<span className="text-[#D93F21]">Hatta</span>.id
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-white hover:text-[#D93F21] transition flex items-center gap-1"
                        >
                            {link.icon === 'help' && <HelpCircle className="w-4 h-4" />}
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* RIGHT SECTION (Search & Auth) */}
                <div className="flex items-center gap-4">
                    {/* Search Bar (Hidden on Mobile) */}
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm focus:outline-none border border-transparent focus:border-[#D93F21] w-32 focus:w-56 transition-all placeholder-gray-400"
                        />
                        <Search className="w-4 h-4 absolute right-3 top-2 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                        
                        {/* LOGIC RENDER UTAMA:
                            1. Jika Loading: Tampilkan Spinner
                            2. Jika User Ada: Tampilkan Menu User
                            3. Jika Tidak Ada: Tampilkan Tombol Masuk
                        */}
                        
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                                <Loader2 className="w-5 h-5 animate-spin text-[#D93F21]" />
                                <span className="text-xs hidden md:block">Memuat...</span>
                            </div>
                        ) : user ? (
                            // --- STATE: SUDAH LOGIN ---
                            <>
                                <Link href="/pelanggan/notifications" className="relative group">
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
                                        <Bell className="w-5 h-5 group-hover:text-[#D93F21] transition-colors" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D93F21] border border-[#1a1a1a]"></span>
                                            </span>
                                        )}
                                    </Button>
                                </Link>

                                <Link href="/profile">
                                    <span className="text-sm text-gray-300 hidden md:block hover:text-white transition font-medium">
                                        Hi, {user.name}
                                    </span>
                                </Link>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="text-white hover:bg-white/10 hover:text-red-400 rounded-full"
                                    title="Keluar"
                                >
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </>
                        ) : (
                            // --- STATE: BELUM LOGIN (GUEST) ---
                            <div className="flex items-center gap-3 hidden md:flex">
                                <Link href="/login" className="text-sm text-white hover:underline decoration-[#D93F21] underline-offset-4">
                                    Masuk
                                </Link>
                                <Link href="/register" className="px-4 py-1.5 bg-[#D93F21] hover:bg-[#b9351b] text-white text-sm rounded-full transition font-medium">
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* MOBILE MENU TRIGGER (Hamburger) */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden text-white hover:bg-white/10 ml-2 relative"
                                >
                                    <Menu className="w-5 h-5" />
                                    {/* Indikator notifikasi di hamburger menu jika ada pesan dan tampilan mobile */}
                                    {user && unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 h-2 w-2 bg-[#D93F21] rounded-full border border-[#1a1a1a]"></span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            
                            <SheetContent side="right" className="w-[280px] bg-[#1a1a1a] text-white border-l border-gray-800/50">
                                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                                
                                <div className="flex flex-col gap-6 mt-8">
                                    <Link href="/" onClick={closeMobileMenu} className="text-xl font-bold tracking-tight">
                                        MainDi<span className="text-[#D93F21]">Hatta</span>.id
                                    </Link>

                                    {/* MENU ITEMS */}
                                    <nav className="flex flex-col gap-3">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={closeMobileMenu}
                                                className="text-white hover:text-[#D93F21] transition flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5"
                                            >
                                                {link.icon === 'help' && <HelpCircle className="w-4 h-4" />}
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>

                                    {/* FOOTER MOBILE MENU */}
                                    <div className="border-t border-gray-700 pt-4">
                                        {isLoading ? (
                                             <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm">Sinkronisasi...</span>
                                             </div>
                                        ) : user ? (
                                            <div className="flex flex-col gap-3">
                                                <Link 
                                                    href="/profile" 
                                                    onClick={closeMobileMenu}
                                                    className="text-white hover:text-[#D93F21] transition flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>Profil Saya ({user.name})</span>
                                                </Link>

                                                <Link 
                                                    href="/pelanggan/notifications" 
                                                    onClick={closeMobileMenu}
                                                    className="text-white hover:text-[#D93F21] transition flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Bell className="w-4 h-4" />
                                                        <span>Notifikasi</span>
                                                    </div>
                                                    {unreadCount > 0 && (
                                                        <span className="bg-[#D93F21] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </Link>

                                                <Button
                                                    variant="ghost"
                                                    onClick={handleLogout}
                                                    className="text-red-400 hover:bg-red-400/10 hover:text-red-300 justify-start gap-2 px-3 w-full"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Keluar
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <Link href="/login" onClick={closeMobileMenu}>
                                                    <Button className="w-full bg-[#D93F21] hover:bg-[#b9351b] text-white">
                                                        Masuk
                                                    </Button>
                                                </Link>
                                                <Link href="/register" onClick={closeMobileMenu}>
                                                    <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-white/10 bg-transparent">
                                                        Daftar
                                                    </Button>
                                                </Link>
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