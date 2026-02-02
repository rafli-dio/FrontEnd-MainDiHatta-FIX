// components/karyawan/HeaderKaryawan.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Clock, Menu } from 'lucide-react'; // Tambah icon Menu
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useKaryawan } from '@/components/karyawan/KaryawanContext'; // Import Context

export default function HeaderKaryawan() {
    const { user } = useAuth({ middleware: 'auth' });
    const { toggleSidebar } = useKaryawan(); // Gunakan Context
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="
            fixed top-0 right-0 z-10 h-16 bg-white border-b border-gray-200 
            flex items-center justify-between px-4 md:px-6 shadow-sm transition-all duration-300
            left-0 md:left-64
        ">
            
            <div className="flex items-center gap-3">
                {/* TOMBOL HAMBURGER (Mobile Only) */}
                <button 
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-gray-600 rounded-md md:hidden hover:bg-gray-100 focus:outline-none"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Jam Digital */}
                <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md text-xs sm:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="font-mono font-semibold">
                        {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="mx-2 text-gray-300 hidden sm:inline">|</span>
                    <span className="font-medium text-gray-500 hidden sm:inline">
                        {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                </div>
            </div>

            {/* Profil Kasir */}
            <Link href="/profile">
                <div className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">ID: {user?.id}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center border border-green-200 text-green-700 font-bold shadow-sm">
                        {user?.name?.charAt(0) || 'K'}
                    </div>
                </div>
            </Link>
        </header>
    );
}