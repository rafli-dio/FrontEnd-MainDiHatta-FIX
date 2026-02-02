'use client';

import Link from 'next/link';
import { PlusCircle, CalendarDays, ListChecks, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import DashboardRecentActivity from '@/components/admin/dashboard/DashboardRecentActivity';

export default function KaryawanDashboard() {
    const { user } = useAuth({ middleware: 'auth' });
    
    const { data, loading, formatRupiah } = useAdminDashboard();

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-6">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
                </div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 p-6 md:p-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
                <p className="text-gray-500 mt-1">Selamat bekerja. Berikut adalah ringkasan operasional hari ini.</p>
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#D93F21] rounded-full"></div>
                    Statistik Hari Ini
                </h3>
                <DashboardStats 
                    summary={data?.summary} 
                    formatRupiah={formatRupiah} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gray-800 rounded-full"></div>
                        Transaksi Terakhir
                    </h3>
                    <DashboardRecentActivity 
                        activities={data?.recent_activity} 
                        formatRupiah={formatRupiah} 
                    />
                </div>
                
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        Panduan Cepat
                    </h3>
                    <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base text-blue-800 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" /> SOP Karyawan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-blue-900/80 space-y-3">
                            <ul className="list-disc list-inside space-y-2 marker:text-blue-500">
                                <li>
                                    <strong>Booking Manual:</strong> Jika ada pelanggan datang langsung (Walk-in), input lewat menu ini.
                                </li>
                                <li>
                                    <strong>Konfirmasi:</strong> Cek menu <em>Booking Lapangan</em> secara berkala untuk memvalidasi pembayaran transfer dari pelanggan online.
                                </li>
                                <li>
                                    <strong>Selesai Main:</strong> Ubah status booking menjadi <strong>"Selesai"</strong> setelah jam main berakhir.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}