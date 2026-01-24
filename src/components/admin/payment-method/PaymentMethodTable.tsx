import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaymentMethod } from '@/types';
// Hapus import sweetAlert karena tidak dipakai di sini lagi
// import { sweetAlert } from '@/lib/sweetAlert'; 

interface PaymentMethodTableProps {
    loading: boolean;
    methods: PaymentMethod[];
    onEdit: (method: PaymentMethod) => void;
    onDelete: (id: number) => void;
}

export default function PaymentMethodTable({
    loading,
    methods,
    onEdit,
    onDelete,
}: PaymentMethodTableProps) {
    // FUNGSI handleDelete LOKAL DIHAPUS

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
                        <TableHead className="font-bold">Nama Metode</TableHead>
                        <TableHead className="font-bold">Keterangan</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {methods.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                Tidak ada data metode pembayaran
                            </TableCell>
                        </TableRow>
                    ) : (
                        methods.map((method, index) => (
                            <TableRow key={method.id} className="hover:bg-gray-50">
                                <TableCell className="w-12">{index + 1}</TableCell>
                                <TableCell className="font-medium">{method.nama_metode}</TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {method.keterangan || '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        className={method.is_aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                                    >
                                        {method.is_aktif ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                        onClick={() => onEdit(method)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                        // LANGSUNG PANGGIL PROP onDelete
                                        onClick={() => onDelete(method.id)} 
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