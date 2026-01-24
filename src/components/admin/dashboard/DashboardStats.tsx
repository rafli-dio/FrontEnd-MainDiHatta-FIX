import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CalendarCheck, Users, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
    summary?: {
        pendapatan_hari_ini: number | string;
        booking_perlu_konfirmasi: number;
        jadwal_main_hari_ini: number;
        jumlah_stok_kritis?: number;
    };
    formatRupiah: (val: number | string) => string;
}

export default function DashboardStats({ summary, formatRupiah }: DashboardStatsProps) {
    if (!summary) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Pendapatan */}
            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Pendapatan Hari Ini
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        {formatRupiah(summary.pendapatan_hari_ini || 0)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total pendapatan booking</p>
                </CardContent>
            </Card>

            {/* Card 2: Booking Pending */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Perlu Konfirmasi
                    </CardTitle>
                    <CalendarCheck className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        {summary.booking_perlu_konfirmasi || 0}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Booking menunggu konfirmasi</p>
                </CardContent>
            </Card>

            {/* Card 3: Jadwal Main */}
            <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Jadwal Main Hari Ini
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        {summary.jadwal_main_hari_ini || 0}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total jam booking hari ini</p>
                </CardContent>
            </Card>
        </div>
    );
}