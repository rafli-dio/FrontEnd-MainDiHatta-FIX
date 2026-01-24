'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from '@/lib/axios';
import { 
    LayoutDashboard, 
    CalendarDays, 
    LogOut,
    PlusCircle,
    List,
    ChevronDown,
    ChevronRight,
    UserCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { sweetAlert } from '@/lib/sweetAlert';

type SubMenuItem = {
    title: string;
    href: string;
    icon?: any;
    showBadge?: boolean;
};

type MenuItem = {
    title: string;
    href: string; 
    icon: any;
    submenu?: SubMenuItem[];
    badgeCount?: number;
};

const karyawanMenuItems: MenuItem[] = [
    { title: 'Dashboard', href: '/karyawan/dashboard', icon: LayoutDashboard},
    
    // --- MENU BOOKING (DROPDOWN) ---
    { 
        title: 'Booking Lapangan', 
        icon: CalendarDays,
        href: '/karyawan/booking', // Parent link (untuk active state)
        submenu: [
            { 
                title: 'Daftar Booking', 
                href: '/karyawan/booking', 
                icon: List,
                showBadge: true // Tampilkan badge notifikasi
            },
            { 
                title: 'Tambah Booking', 
                href: '/karyawan/booking/create', 
                icon: PlusCircle 
            },
        ]
    },
    // -------------------------------
];

export default function SidebarKaryawan() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

    const handleLogout = async () => {
        const result = await sweetAlert.confirmLogout();
        if (result.isConfirmed) {
            logout();
        }
    };

    // 1. Fetch Notifikasi Booking (Sama seperti Admin)
    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const response = await axios.get('/api/bookings');
                const bookings = response.data?.data || response.data;
                // Hitung status "Menunggu Konfirmasi" (ID 2)
                const count = bookings.filter((b: any) => b.status_booking_id === 2).length;
                setPendingBookingsCount(count);
            } catch (error) {
                console.error("Gagal memuat notifikasi booking", error);
            }
        };

        fetchPendingCount();
        const interval = setInterval(fetchPendingCount, 30000); // Auto refresh 30s
        return () => clearInterval(interval);
    }, []);

    // 2. Auto Expand Menu Aktif
    useEffect(() => {
        karyawanMenuItems.forEach(item => {
            if (item.submenu) {
                const isChildActive = item.submenu.some(sub => pathname === sub.href || pathname.startsWith(`${sub.href}/`));
                // Khusus booking agar parent tetap aktif
                const isParentActive = item.href && pathname.startsWith(item.href);
                
                if (isChildActive || isParentActive) {
                    setExpandedMenus(prev => prev.includes(item.title) ? prev : [...prev, item.title]);
                }
            }
        });
    }, [pathname]);

    const toggleMenu = (title: string) => {
        setExpandedMenus(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title) 
                : [...prev, title] 
        );
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20 shadow-sm">
            {/* 1. Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">
                    MainDi<span className="text-[#D93F21]">Hatta</span>
                </h1>
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                    Kasir
                </span>
            </div>

            {/* 2. Menu Items */}
            <nav className="flex-1 py-6 px-3 space-y-1 custom-scrollbar overflow-y-auto">
                {karyawanMenuItems.map((item) => {
                    
                    // Logic Badge di Parent
                    let parentBadge = undefined;
                    if (item.title === 'Booking Lapangan' && pendingBookingsCount > 0 && !expandedMenus.includes(item.title)) {
                        parentBadge = pendingBookingsCount;
                    }

                    // A. MENU TUNGGAL
                    if (!item.submenu) {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
                                    isActive
                                        ? 'bg-[#D93F21] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <item.icon 
                                    className={`w-5 h-5 mr-3 transition-colors ${
                                        isActive ? 'text-white' : 'text-gray-500'
                                    }`} 
                                />
                                {item.title}
                            </Link>
                        );
                    }

                    // B. MENU DROPDOWN
                    const isExpanded = expandedMenus.includes(item.title);
                    const isChildActive = item.submenu.some(sub => pathname === sub.href || pathname.startsWith(`${sub.href}/`));

                    return (
                        <div key={item.title} className="space-y-1 mb-1">
                            <button
                                onClick={() => toggleMenu(item.title)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    isChildActive 
                                        ? 'text-gray-900 bg-gray-100' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className="flex items-center">
                                    <item.icon 
                                        className={`w-5 h-5 mr-3 ${
                                            isChildActive ? 'text-[#D93F21]' : 'text-gray-500'
                                        }`} 
                                    />
                                    {item.title}
                                </div>
                                <div className="flex items-center gap-2">
                                    {parentBadge && (
                                        <Badge className="bg-red-500 hover:bg-red-600 text-white border-none h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
                                            {parentBadge}
                                        </Badge>
                                    )}
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {/* SUBMENU ITEMS */}
                            {isExpanded && (
                                <div className="space-y-1 pl-4 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-gray-200">
                                    {item.submenu.map((subItem) => {
                                        const isSubActive = pathname === subItem.href;
                                        
                                        return (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors relative z-10 ${
                                                    isSubActive
                                                        ? 'text-[#D93F21] bg-red-50'
                                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    {subItem.icon && (
                                                        <subItem.icon className={`w-4 h-4 mr-2 ${isSubActive ? 'text-[#D93F21]' : 'text-gray-400'}`} />
                                                    )}
                                                    {subItem.title}
                                                </div>
                                                {/* Badge Submenu */}
                                                {subItem.showBadge && pendingBookingsCount > 0 && (
                                                     <Badge className="bg-red-500 hover:bg-red-600 text-white border-none h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
                                                        {pendingBookingsCount}
                                                    </Badge>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* 3. Footer Sidebar */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center mb-4 px-2">
                    <UserCircle className="w-8 h-8 text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm font-bold text-gray-700">Akun Kasir</p>
                        <p className="text-xs text-green-600 font-medium">● Online</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar Shift
                </button>
            </div>
        </aside>
    );
}