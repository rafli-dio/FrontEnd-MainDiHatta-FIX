'use client';

import { 
    Pencil, Trash2, Loader2, Search, 
    AlertCircle, Clock, CheckCircle2, Ban, CheckSquare, AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StatusBooking } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

interface StatusBookingTableProps {
    loading: boolean;
    statuses: StatusBooking[];
    totalData: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onEdit: (item: StatusBooking) => void;
    onDelete: (id: number) => void;
}

export default function StatusBookingTable({
    loading,
    statuses,
    totalData,
    currentPage,
    itemsPerPage,
    onPageChange,
    onEdit,
    onDelete
}: StatusBookingTableProps) {
    
    const totalPages = Math.ceil(totalData / itemsPerPage);
    const startNumber = (currentPage - 1) * itemsPerPage + 1;

    // REVISI: Gunakan ID sebagai acuan utama (lebih stabil daripada nama)
    const getStatusBadge = (status: StatusBooking) => {
        const id = Number(status.id);

        switch (id) {
            case 1: // Pending / Pembayaran
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex w-fit gap-1">
                        <AlertCircle className="w-3 h-3" /> {status.nama_status}
                    </Badge>
                );
            case 2: // Menunggu Konfirmasi
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex w-fit gap-1">
                        <Clock className="w-3 h-3" /> {status.nama_status}
                    </Badge>
                );
            case 3: // Terkonfirmasi / Lunas
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex w-fit gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {status.nama_status}
                    </Badge>
                );
            case 4: // Batal
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex w-fit gap-1">
                        <Ban className="w-3 h-3" /> {status.nama_status}
                    </Badge>
                );
            case 5: // Selesai
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 flex w-fit gap-1">
                        <CheckSquare className="w-3 h-3" /> {status.nama_status}
                    </Badge>
                );
            case 6: // Dibatalkan Admin (Maintenance) - KHUSUS
                return (
                    <Badge className="bg-red-600 hover:bg-red-700 text-white border-none flex w-fit gap-1 shadow-sm">
                        <AlertTriangle className="w-3 h-3" /> {status.nama_status}
                    </Badge>
                );
            default: // Status Custom (ID 7++)
                return <Badge variant="secondary">{status.nama_status}</Badge>;
        }
    };

    const handleDelete = async (status: StatusBooking) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus Status Booking?',
            `Apakah Anda yakin ingin menghapus status:\n"${status.nama_status}"?`
        );
        if (result.isConfirmed) {
            onDelete(status.id);
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-[50px] text-center font-semibold text-gray-600">No</TableHead>
                        <TableHead className="font-semibold text-gray-600">Nama Status</TableHead>
                        <TableHead className="font-semibold text-gray-600">Tampilan Badge</TableHead>
                        <TableHead className="w-[100px] text-center font-semibold text-gray-600">ID Sistem</TableHead>
                        <TableHead className="text-right font-semibold text-gray-600">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : statuses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <Search className="h-8 w-8 text-gray-300 mb-2" />
                                    <p>Tidak ada data status.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        statuses.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="text-center text-gray-500 font-medium">
                                    {startNumber + index}
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {item.nama_status}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(item)}
                                </TableCell>
                                <TableCell className="text-center text-xs text-gray-400 font-mono">
                                    {/* Indikator Visual untuk ID Sistem */}
                                    <span className={`px-2 py-1 rounded font-bold ${
                                        item.id <= 6 
                                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                                    }`}>
                                        ID: {item.id}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => onEdit(item)}
                                        className="hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(item)}
                                        // PROTEKSI: ID 1-6 Jangan Dihapus
                                        disabled={item.id <= 6} 
                                        title={item.id <= 6 ? "Status sistem tidak bisa dihapus" : "Hapus Status"}
                                        className={`hover:bg-red-50 hover:text-red-600 ${item.id <= 6 ? "opacity-30 cursor-not-allowed" : ""}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
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