import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ActivityItem {
    id: number;
    keterangan: string;
    kredit?: string | number;
    debit?: string | number;
    nominal?: string | number;
    jenis_transaksi?: {
        tipe: string;
    };
    created_at: string;
}

interface DashboardRecentActivityProps {
    activities?: ActivityItem[];
    formatRupiah: (val: number | string) => string;
}

export default function DashboardRecentActivity({ activities, formatRupiah }: DashboardRecentActivityProps) {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>5 transaksi terakhir di sistem.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {(!activities || activities.length === 0) ? (
                        <p className="text-sm text-gray-500 text-center py-4">Belum ada transaksi.</p>
                    ) : (
                        activities.map((item) => {
                            const isMasuk = item.jenis_transaksi?.tipe === 'masuk' || Number(item.kredit) > 0;
                            const nominalValue = item.nominal || (isMasuk ? item.kredit : item.debit) || 0;

                            return (
                                <div key={item.id} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-gray-900 line-clamp-1">
                                            {item.keterangan}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { 
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>
                                    <div className={`ml-auto font-medium text-sm ${isMasuk ? 'text-green-600' : 'text-red-600'}`}>
                                        {isMasuk 
                                            ? `+${formatRupiah(nominalValue)}` 
                                            : `-${formatRupiah(nominalValue)}`
                                        }
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}