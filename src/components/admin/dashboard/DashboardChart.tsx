'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProcessedChartData } from '@/hooks/admin/useAdminDashboard';

interface DashboardChartProps {
    data: ProcessedChartData[];
    formatRupiah: (val: number | string) => string;
}

const CustomTooltip = ({ active, payload, label, formatRupiah }: any) => {
    if (active && payload && payload.length) {
        const payload0 = payload[0];
        const dateDisplay = payload0?.payload?.dateDisplay;
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                <p className="text-sm font-bold text-gray-700">{label}{dateDisplay ? ` • ${dateDisplay}` : ''}</p>
                <p className="text-sm text-[#D93F21]">
                    {formatRupiah(payload0.value)}
                </p>
            </div>
        );
    }
    return null;
};

export default function DashboardChart({ data, formatRupiah }: DashboardChartProps) {
    return (
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Overview Pendapatan</CardTitle>
                <CardDescription>Grafik pendapatan 7 hari terakhir.</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {data && data.length > 0 ? (
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D93F21" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#D93F21" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(value) => `Rp${value / 1000}k`} 
                                />
                                <Tooltip content={<CustomTooltip formatRupiah={formatRupiah} />} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#D93F21" 
                                    fillOpacity={1} 
                                    fill="url(#colorTotal)" 
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        ) : (
                            <div className="flex items-center justify-center h-full w-full text-gray-500">Tidak ada data pendapatan untuk periode ini</div>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}