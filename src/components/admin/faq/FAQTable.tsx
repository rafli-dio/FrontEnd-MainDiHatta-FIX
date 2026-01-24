'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FAQ } from '@/types';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface FAQTableProps {
    faqs: FAQ[];
    loading: boolean;
    onEdit: (faq: FAQ) => void;
    onDelete: (faq: FAQ) => void;
    onToggleStatus: (faq: FAQ) => Promise<void>;
    togglingId?: number | null;
}

export default function FAQTable({
    faqs,
    loading,
    onEdit,
    onDelete,
    onToggleStatus,
    togglingId
}: FAQTableProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Daftar FAQ</CardTitle>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Total: {faqs.length}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 text-left font-medium text-gray-700">No</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Pertanyaan</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        <Loader2 className="h-6 w-6 animate-spin inline mr-2" />
                                        Memuat FAQ...
                                    </td>
                                </tr>
                            ) : faqs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        Tidak ada FAQ
                                    </td>
                                </tr>
                            ) : (
                                faqs.map((faq, index) => (
                                    <tr key={faq.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-gray-700 font-medium">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-md">
                                                <p className="font-medium text-gray-900 line-clamp-2">
                                                    {faq.pertanyaan}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                    {faq.jawaban}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={faq.is_aktif ? 'default' : 'secondary'}
                                                className={
                                                    faq.is_aktif
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }
                                            >
                                                {faq.is_aktif ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onToggleStatus(faq)}
                                                    disabled={togglingId === faq.id}
                                                    title={faq.is_aktif ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    {togglingId === faq.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : faq.is_aktif ? (
                                                        <Eye className="w-4 h-4" />
                                                    ) : (
                                                        <EyeOff className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onEdit(faq)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onDelete(faq)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
