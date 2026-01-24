'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from '@/lib/axios'; 
import { 
    LayoutDashboard, 
    Users, 
    CalendarDays, 
    Wallet, 
    LogOut,
    Box,
    Settings,
    Info,
    ChevronDown, 
    ChevronRight,
    PlusCircle,
    List,
    HelpCircle
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
    href?: string; 
    icon: any;
    submenu?: SubMenuItem[];
    badgeCount?: number; 
};

const baseMenuItems: MenuItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    
    { title: 'Data Lapangan', href: '/admin/lapangan', icon: Box },

    { 
        title: 'Data Master', 
        icon: Settings,
        submenu: [
            { title: 'Metode Pembayaran', href: '/admin/master/payment-method', icon: Wallet },
            { title: 'Status Booking', href: '/admin/master/status-booking', icon: Info },
        ]
    },

    { 
        title: 'Booking Lapangan', 
        icon: CalendarDays,
        href: '/admin/bookings',
        submenu: [
            { 
                title: 'Daftar Booking', 
                href: '/admin/bookings', 
                icon: List,
                showBadge: true
            },
            { 
                title: 'Tambah Booking', 
                href: '/admin/bookings/create', 
                icon: PlusCircle 
            },
        ]
    },
    
    { title: 'Manajemen Users', href: '/admin/users', icon: Users },
    { title: 'Laporan Keuangan', href: '/admin/keuangan', icon: Wallet },
    { title: 'Manajemen FAQ', href: '/admin/faq', icon: HelpCircle },
];

export default function Sidebar() {
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

    // Fetch Notifikasi
    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const response = await axios.get('/api/bookings');
                const bookings = response.data;
                const count = bookings.filter((b: any) => b.status_booking_id === 2).length;
                setPendingBookingsCount(count);
            } catch (error) {
                console.error("Gagal memuat notifikasi booking", error);
            }
        };

        fetchPendingCount();
        const interval = setInterval(fetchPendingCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Auto expand menu aktif (LOGIKA INVENTARIS SUDAH DIHAPUS)
    useEffect(() => {
        baseMenuItems.forEach(item => {
            if (item.submenu) {
                // Cek apakah ada submenu yang aktif
                const isChildActive = item.submenu.some(sub => 
                    pathname === sub.href || pathname.startsWith(sub.href + '/')
                );
                
                // Khusus Booking (karena parent href sama dengan child href)
                const isBookingActive = item.title === 'Booking Lapangan' && pathname.startsWith('/admin/bookings');

                if (isChildActive || isBookingActive) {
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
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20">
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                    MainDi<span className="text-[#D93F21]">Hatta</span>
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                {baseMenuItems.map((item) => {
                    
                    // Logic Badge di Parent Menu
                    let parentBadge = undefined;
                    if (item.title === 'Booking Lapangan' && pendingBookingsCount > 0 && !expandedMenus.includes(item.title)) {
                        parentBadge = pendingBookingsCount;
                    }

                    // A. MENU TUNGGAL (Tanpa Submenu)
                    if (!item.submenu) {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.title}
                                href={item.href!}
                                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                    isActive
                                        ? 'bg-red-50 text-[#D93F21]'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className="flex items-center">
                                    <item.icon 
                                        className={`w-5 h-5 mr-3 transition-colors ${
                                            isActive ? 'text-[#D93F21]' : 'text-gray-400 group-hover:text-gray-600'
                                        }`} 
                                    />
                                    {item.title}
                                </div>
                            </Link>
                        );
                    }

                    // B. MENU DROPDOWN
                    const isExpanded = expandedMenus.includes(item.title);
                    
                    // Logic Active Parent
                    const isParentActive = item.submenu.some(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'));

                    return (
                        <div key={item.title} className="space-y-1">
                            <button
                                onClick={() => toggleMenu(item.title)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    isParentActive 
                                        ? 'text-gray-900 bg-gray-50' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className="flex items-center">
                                    <item.icon 
                                        className={`w-5 h-5 mr-3 ${
                                            isParentActive ? 'text-[#D93F21]' : 'text-gray-400'
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
                                        // Logic Active Submenu
                                        let isSubActive = pathname === subItem.href;

                                        if (!isSubActive && pathname.startsWith(subItem.href)) {
                                            // Cek apakah ada sibling yang lebih cocok
                                            const betterMatch = item.submenu?.find(sibling => 
                                                sibling.href !== subItem.href && 
                                                sibling.href.length > subItem.href.length && 
                                                pathname.startsWith(sibling.href)
                                            );
                                            
                                            if (!betterMatch) {
                                                if (pathname.length === subItem.href.length || pathname.charAt(subItem.href.length) === '/') {
                                                     isSubActive = true;
                                                }
                                            }
                                        }
                                        
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

            <div className="p-4 border-t border-gray-200">
                <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
}