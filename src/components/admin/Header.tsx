'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react'; 
import { useAdmin } from '@/components/admin/AdminContext';

export default function Header() {
    const { user } = useAuth({ middleware: 'auth' });
    const { toggleSidebar } = useAdmin();
    const [imageError, setImageError] = useState(false);

    useEffect(() => { setImageError(false); }, [user?.foto_url]);

    return (
        <header className="
            fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 
            flex items-center justify-between px-4 md:px-8 
            transition-all duration-300
            left-0 md:left-64 
        ">
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-gray-600 rounded-md md:hidden hover:bg-gray-100 focus:outline-none"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <h2 className="text-lg font-semibold text-gray-800">Admin Portal</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Memuat...'}</p>
                    <p className="text-xs text-gray-500">{user?.role?.name_role || 'Administrator'}</p>
                </div>
                <Link href="/profile">
                    <div className="relative h-10 w-10 rounded-full bg-[#D93F21]/10 flex items-center justify-center border border-[#D93F21]/20 shadow-sm overflow-hidden hover:ring-2 hover:ring-[#D93F21]/50 transition-all">
                        {user?.foto_url && !imageError ? (
                            <Image src={user.foto_url} alt="Profile" fill className="object-cover" unoptimized onError={() => setImageError(true)} />
                        ) : (
                            <span className="text-lg font-bold text-[#D93F21]">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</span>
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}