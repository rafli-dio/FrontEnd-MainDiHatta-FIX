'use client';

import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';

// Import Komponen UI Pecahan
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import DashboardChart from '@/components/admin/dashboard/DashboardChart';
import DashboardRecentActivity from '@/components/admin/dashboard/DashboardRecentActivity';

export default function AdminDashboard() {
    // Panggil logika dari Custom Hook
    const { data, chartData, loading, formatRupiah } = useAdminDashboard();

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                     <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                     <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    <div className="lg:col-span-4 h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="lg:col-span-3 h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Ringkasan aktivitas booking lapangan MainDiHatta hari ini.</p>
            </div>
            
            {/* Statistik Cards */}
            <DashboardStats 
                summary={data?.summary} 
                formatRupiah={formatRupiah} 
            />

            {/* Chart & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Chart Section - Lebih lebar */}
                <div className="lg:col-span-3">
                    <DashboardChart 
                        data={chartData} 
                        formatRupiah={formatRupiah} 
                    />
                </div>
                
                {/* Activity Section - Lebih sempit */}
                <div className="lg:col-span-2">
                    <DashboardRecentActivity 
                        activities={data?.recent_activity} 
                        formatRupiah={formatRupiah} 
                    />
                </div>
            </div>
        </div>
    );
}