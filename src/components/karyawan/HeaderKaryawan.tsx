'use client';

import { useAuth } from '@/hooks/useAuth';
import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeaderKaryawan() {
    const { user } = useAuth({ middleware: 'auth' });
    const [time, setTime] = useState(new Date());

    // Efek jam digital real-time (Penting untuk kasir)
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-0 md:left-64 z-10 shadow-sm">
            
            {/* Jam Digital */}
            <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-mono font-semibold">
                    {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-xs font-medium text-gray-500">
                    {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>

            {/* Profil Kasir */}
            <Link href="/profile">
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">ID: {user?.id}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center border border-green-200 text-green-700 font-bold">
                    {user?.name?.charAt(0) || 'K'}
                </div>
            </div>
            </Link>
        </header>
    );
}