'use client';

import { Eye, CheckCircle, AlertCircle, Ban, Clock, CheckSquare, AlertTriangle } from 'lucide-react';
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

    const getStatusBadge = (rawId: number | string) => {
        const id = Number(rawId);

        switch(id) {
            case 1: 
                return (
                    <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50 w-full justify-center">
                        <AlertCircle className="w-3 h-3 mr-1"/> Pending
                    </Badge>
                );
            case 2: 
                return (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white w-full justify-center">
                        <Clock className="w-3 h-3 mr-1"/> Konfirmasi
                    </Badge>
                );
            case 3: 
                return (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white w-full justify-center">
                        <CheckCircle className="w-3 h-3 mr-1"/> Lunas
                    </Badge>
                );
            case 4: 
                return (
                    <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white w-full justify-center">
                        <Ban className="w-3 h-3 mr-1"/> Batal
                    </Badge>
                );
            case 5: 
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 w-full justify-center">
                        <CheckSquare className="w-3 h-3 mr-1"/> Selesai
                    </Badge>
                );
            case 6: 
                return (
                    <Badge className="bg-red-700 hover:bg-red-800 text-white w-full justify-center shadow-sm">
                        <AlertTriangle className="w-3 h-3 mr-1"/> Batal Admin
                    </Badge>
                );
            default: 
                return <Badge variant="secondary">ID: {rawId}</Badge>;
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            {/* Tambahan Wrapper Responsive */}
            <div className="overflow-x-auto">
                <Table className="min-w-[800px]"> 
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="w-12 text-center py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">No</TableHead>
                            <TableHead className="font-bold text-gray-600 py-3 px-4 text-xs">Kode Booking</TableHead>
                            <TableHead className="font-bold text-gray-600 py-3 px-4 text-xs">Jadwal Main</TableHead>
                            <TableHead className="font-bold text-gray-600 py-3 px-4 text-xs">Pemesan</TableHead>
                            <TableHead className="font-bold text-gray-600 py-3 px-4 text-xs">Lapangan</TableHead>
                            <TableHead className="font-bold text-gray-600 py-3 px-4 text-xs text-center w-[160px]">Status</TableHead>
                            <TableHead className="text-right font-bold text-gray-600 py-3 px-4 text-xs">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                                        <span>Memuat data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-gray-500 italic">
                                    Belum ada data booking.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((item, idx) => (
                                <TableRow key={item.id} className="hover:bg-blue-50/30 border-b transition-colors group">
                                    <TableCell className="text-sm text-gray-500 text-center font-mono py-3 px-4">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="font-mono font-medium py-3 px-4 text-blue-600">
                                        {item.kode_booking}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium text-gray-900">{formatDate(item.tanggal_booking)}</span>
                                            <span className="text-xs text-gray-500">{item.jam_mulai} - {item.jam_selesai}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 px-4 max-w-[200px]">
                                        <div className="font-medium text-gray-900 truncate" title={item.nama_pengirim || item.user?.name}>
                                            {item.nama_pengirim || item.user?.name || '-'}
                                        </div>
                                        {item.acara && (
                                            <div className="text-xs text-gray-500 truncate" title={item.acara}>
                                                Club: {item.acara}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 max-w-[150px] text-sm text-gray-600 truncate">
                                        {item.lapangan?.nama_lapangan || '-'}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-center">
                                        {getStatusBadge(item.status_booking_id)}
                                    </TableCell>
                                    <TableCell className="text-right py-3 px-4">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => onView(item)} 
                                            className="text-gray-600 border-gray-300 hover:text-blue-600 hover:border-blue-300 h-8"
                                        >
                                            <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}