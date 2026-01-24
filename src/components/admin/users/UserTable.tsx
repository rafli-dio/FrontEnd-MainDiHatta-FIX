'use client';

import { Pencil, Trash2, Loader2, Search } from 'lucide-react';
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
import { User } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

interface UserTableProps {
    loading: boolean;
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

export default function UserTable({
    loading,
    users,
    onEdit,
    onDelete
}: UserTableProps) {

    // Helper Role Color
    const getRoleBadge = (roleName?: string) => {
        switch(roleName) {
            case 'Admin': return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 shadow-none">Admin</Badge>;
            case 'Karyawan': return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 shadow-none">Karyawan</Badge>;
            case 'Pelanggan': return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 shadow-none">Pelanggan</Badge>;
            default: return <Badge variant="outline">{roleName}</Badge>;
        }
    };

    // Handle delete with confirmation
    const handleDelete = async (user: User) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus User?',
            `Apakah Anda yakin ingin menghapus user:\n"${user.name}"?`
        );
        if (result.isConfirmed) {
            onDelete(user.id);
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-[50px] text-center">No</TableHead>
                        <TableHead>Nama Lengkap</TableHead>
                        <TableHead>Email & Kontak</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-5 w-5 animate-spin inline mr-2"/> Memuat...</TableCell></TableRow>
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <Search className="h-8 w-8 text-gray-300 mb-2" />
                                    <p>User tidak ditemukan.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-gray-50">
                                <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                                <TableCell>
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.alamat || '-'}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-gray-600">{item.email}</div>
                                    <div className="text-xs text-gray-500">{item.nomor_telepon || '-'}</div>
                                </TableCell>
                                <TableCell>
                                    {getRoleBadge(item.role?.name_role)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="hover:bg-blue-50 hover:text-blue-600">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="hover:bg-red-50 hover:text-red-600">
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