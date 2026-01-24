'use client';

import Image from 'next/image';
import { Pencil, Trash2, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lapangan } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

interface LapanganGridProps {
    loading: boolean;
    lapangans: Lapangan[];
    onEdit: (item: Lapangan) => void;
    onDelete: (id: number) => void;
}

export default function LapanganGrid({
    loading,
    lapangans,
    onEdit,
    onDelete
}: LapanganGridProps) {

    const formatRupiah = (num: number | string) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(num));

    const handleDelete = async (lapangan: Lapangan) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus Lapangan?',
            `Apakah Anda yakin ingin menghapus lapangan:\n"${lapangan.nama_lapangan}"?`
        );
        if (result.isConfirmed) {
            onDelete(lapangan.id);
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Memuat data lapangan...</div>;
    }

    if (lapangans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                <AlertCircle className="w-10 h-10 mb-2 text-gray-400" />
                <p>Belum ada data lapangan.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lapangans.map((item) => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-gray-200">
                    <div className="relative h-48 w-full bg-gray-100">
                        {item.foto_url ? (
                            <Image 
                                src={item.foto_url} 
                                alt={item.nama_lapangan} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                                onError={(e) => (e.target as HTMLElement).style.display = 'none'}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                        
                        <div className="absolute top-2 right-2">
                            {item.status_aktif ? (
                                <Badge className="bg-green-500 hover:bg-green-600 shadow-sm">Aktif</Badge>
                            ) : (
                                <Badge variant="destructive" className="shadow-sm">Non-Aktif</Badge>
                            )}
                        </div>
                    </div>
                    
                    <CardContent className="p-5 space-y-4">
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#D93F21]" /> {item.nama_lapangan}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-[40px]">
                                {item.deskripsi || 'Tidak ada deskripsi.'}
                            </p>
                        </div>

                        <div className="flex justify-between items-center text-sm border-t pt-4 border-gray-100">
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                <Clock className="w-4 h-4" />
                                <span>{item.jam_buka.substring(0, 5)} - {item.jam_tutup.substring(0, 5)}</span>
                            </div>
                            <div className="font-bold text-[#D93F21] text-lg">
                                {formatRupiah(item.harga_per_jam)} <span className="text-xs text-gray-400 font-normal">/jam</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" className="flex-1 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50" onClick={() => onEdit(item)}>
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                            </Button>
                            <Button variant="outline" className="flex-1 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(item.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Hapus
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}