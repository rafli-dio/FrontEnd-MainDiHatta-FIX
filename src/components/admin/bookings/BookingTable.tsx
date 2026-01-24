'use client';

import { Eye, CheckCircle, AlertCircle, Ban, Clock, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Booking } from '@/types';

interface BookingTableProps {
    bookings: Booking[];
    onView: (booking: Booking) => void;
    loading: boolean;
}

export default function BookingTable({ bookings, onView, loading }: BookingTableProps) {
    
    const formatDate = (dateString: string) => 
        new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const getStatusBadge = (id: number) => {
        switch(id) {
            case 1: 
                return (
                    <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">
                        <AlertCircle className="w-3 h-3 mr-1"/> Menunggu Pembayaran
                    </Badge>
                );
            case 2: 
                return (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Clock className="w-3 h-3 mr-1"/> Menunggu Konfirmasi
                    </Badge>
                );
            case 3: 
                return (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-3 h-3 mr-1"/> Terkonfirmasi
                    </Badge>
                );
            case 4: 
                return (
                    <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                        <Ban className="w-3 h-3 mr-1"/> Dibatalkan
                    </Badge>
                );
            case 5: 
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                        <CheckSquare className="w-3 h-3 mr-1"/> Selesai
                    </Badge>
                );
            default: 
                return <Badge variant="secondary">Status: {id}</Badge>;
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-12 text-center py-3 px-4 text-xs text-gray-500 uppercase tracking-wide">No</TableHead>
                        <TableHead className="font-mono py-3 px-4 text-xs text-gray-500">Kode</TableHead>
                        <TableHead className="py-3 px-4 text-xs text-gray-500">Tanggal</TableHead>
                        <TableHead className="text-xs py-3 px-4 text-gray-500">Jam</TableHead>
                        <TableHead className="py-3 px-4 text-xs text-gray-500">Pemesan</TableHead>
                        <TableHead className="py-3 px-4 text-xs text-gray-500">Lapangan</TableHead>
                        <TableHead className="py-3 px-4 text-xs text-gray-500">Status</TableHead>
                        <TableHead className="text-right py-3 px-4 text-xs text-gray-500">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow><TableCell colSpan={8} className="h-24 text-center py-6">Memuat...</TableCell></TableRow>
                    ) : bookings.length === 0 ? (
                        <TableRow><TableCell colSpan={8} className="h-32 text-center text-gray-500 py-6">Belum ada data booking.</TableCell></TableRow>
                    ) : (
                        bookings.map((item, idx) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 even:bg-gray-50 border-b">
                                <TableCell className="text-sm text-gray-600 font-medium text-center py-3 px-4">{idx + 1}</TableCell>
                                <TableCell className="font-mono font-medium py-3 px-4 truncate max-w-[140px]">{item.kode_booking}</TableCell>
                                <TableCell className="py-3 px-4">{formatDate(item.tanggal_booking)}</TableCell>
                                <TableCell className="text-xs py-3 px-4">{item.jam_mulai} - {item.jam_selesai}</TableCell>
                                <TableCell className="py-3 px-4 max-w-[220px]">
                                    {/* Tampilkan Nama Pengirim (Manual) atau Nama User (Member) */}
                                    <div className="font-medium truncate">
                                        {item.nama_pengirim || item.user?.name || '-'}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">{item.acara || '-'}</div>
                                </TableCell>
                                <TableCell className="py-3 px-4 max-w-[140px] truncate">{item.lapangan?.nama_lapangan}</TableCell>
                                <TableCell className="py-3 px-4 w-40">
                                    {getStatusBadge(item.status_booking_id)}
                                </TableCell>
                                <TableCell className="text-right py-3 px-4">
                                    <Button variant="ghost" size="sm" onClick={() => onView(item)} className="text-blue-600 hover:bg-blue-50">
                                        <Eye className="w-4 h-4 mr-1" /> Detail
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}