'use client';

import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Transaksi } from '@/hooks/admin/useKeuanganPage';

interface KeuanganJurnalTableProps {
    loading: boolean;
    transactions: Transaksi[];
    formatRupiah: (val: number) => string;
    formatDate: (val: string) => string;
}

export default function KeuanganJurnalTable({
    loading,
    transactions,
    formatRupiah,
    formatDate
}: KeuanganJurnalTableProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Jurnal Transaksi</CardTitle>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Menampilkan {transactions.length} data
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-[150px]">Tanggal</TableHead>
                                <TableHead>Keterangan</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead className="text-right text-green-600">Pemasukan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                        <Loader2 className="h-6 w-6 animate-spin inline mr-2 text-gray-400" /> 
                                        <span className="text-sm">Memuat jurnal...</span>
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                        Tidak ada transaksi pada periode ini.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((trx) => (
                                    <TableRow key={trx.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-gray-600 text-sm">
                                            {formatDate(trx.tanggal_transaksi)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {trx.keterangan}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {trx.jenis_transaksi.nama_jenis}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-green-700 font-bold">
                                            {Number(trx.kredit) > 0 ? formatRupiah(Number(trx.kredit)) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}