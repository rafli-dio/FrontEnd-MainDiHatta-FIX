import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StatusBooking } from '@/types';
// import { sweetAlert } from '@/lib/sweetAlert'; // Hapus import ini karena tidak dipakai

interface SimpleStatusBookingTableProps {
    loading: boolean;
    statuses: StatusBooking[];
    onEdit: (status: StatusBooking) => void;
    onDelete: (id: number) => void;
}

export default function SimpleStatusBookingTable({
    loading,
    statuses,
    onEdit,
    onDelete,
}: SimpleStatusBookingTableProps) {
    
    // HAPUS FUNGSI handleDelete LOKAL DISINI
    // Biarkan logic alert ditangani oleh parent component (Page/Hook)

    if (loading) {
        return (
            <Card className="p-6">
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-bold">No</TableHead>
                        <TableHead className="font-bold">Nama Status</TableHead>
                        <TableHead className="font-bold text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {statuses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                Tidak ada data status booking
                            </TableCell>
                        </TableRow>
                    ) : (
                        statuses.map((status, index) => (
                            <TableRow key={status.id} className="hover:bg-gray-50">
                                <TableCell className="w-12">{index + 1}</TableCell>
                                <TableCell className="font-medium">{status.nama_status}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                        onClick={() => onEdit(status)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                        // LANGSUNG PANGGIL PROP onDelete
                                        onClick={() => onDelete(status.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}