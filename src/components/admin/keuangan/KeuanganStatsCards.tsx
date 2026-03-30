'use client';

import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KeuanganStatsCardsProps {
    pemasukan: number;
    formatRupiah: (val: number) => string;
}

export default function KeuanganStatsCards({
    pemasukan,
    formatRupiah
}: KeuanganStatsCardsProps) {
    return (
        <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Pemasukan (Periode Ini)</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-green-700">
                    {formatRupiah(pemasukan)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Dari Booking Lapangan</p>
            </CardContent>
        </Card>
    );
}