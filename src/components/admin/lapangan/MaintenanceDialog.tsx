'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, CalendarX, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface MaintenanceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    lapanganId: number | null;
}

export default function MaintenanceDialog({ isOpen, onOpenChange, lapanganId }: MaintenanceDialogProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [form, setForm] = useState({
        start_date: '',
        end_date: '',
        keterangan: ''
    });

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    // Fetch History saat dialog dibuka
    useEffect(() => {
        if (isOpen && lapanganId) {
            fetchHistory();
            setForm({ start_date: '', end_date: '', keterangan: '' });
            setWarningMsg(null);
        }
    }, [isOpen, lapanganId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Note: Idealnya API maintenance support filter by lapangan_id
            // Jika belum ada filter di backend, endpoint ini akan return semua jadwal.
            // Anda bisa tambahkan logic filter di backend atau filter manual di sini.
            const res = await axios.get('/api/maintenance'); 
            const allData = res.data?.data || [];
            
            // Filter hanya milik lapangan ini
            const myData = allData.filter((m: any) => m.lapangan_id === lapanganId);
            setHistory(myData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lapanganId) return;

        setIsSaving(true);
        setWarningMsg(null);

        try {
            const payload = {
                lapangan_id: lapanganId,
                start_date: form.start_date, // pastikan format input date sesuai (YYYY-MM-DD)
                end_date: form.end_date,
                keterangan: form.keterangan
            };

            const res = await axios.post('/api/maintenance', payload);
            
            // Cek jika ada warning dari backend (soal booking bentrok)
            if (res.data?.warning) {
                setWarningMsg(res.data.warning);
                toast.warning("Jadwal disimpan, tapi ada booking bentrok!", { duration: 5000 });
            } else {
                toast.success("Jadwal libur berhasil ditambahkan.");
            }

            // Reset form & Refresh list
            setForm({ start_date: '', end_date: '', keterangan: '' });
            fetchHistory();

        } catch (error: any) {
            const msg = error.response?.data?.message || 'Gagal menyimpan.';
            const errDetails = error.response?.data?.errors;
            
            if (errDetails) {
                // Tampilkan error validasi pertama
                const firstKey = Object.keys(errDetails)[0];
                toast.error(`${firstKey}: ${errDetails[firstKey][0]}`);
            } else {
                toast.error(msg);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus jadwal libur ini? Slot akan terbuka kembali.')) return;
        try {
            await axios.delete(`/api/maintenance/${id}`);
            toast.success("Jadwal libur dihapus.");
            fetchHistory();
        } catch (error) {
            toast.error("Gagal menghapus.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarX className="w-5 h-5 text-red-500" /> Atur Jadwal Libur / Maintenance
                    </DialogTitle>
                    <DialogDescription>
                        Lapangan tidak akan bisa dibooking pada rentang tanggal ini.
                    </DialogDescription>
                </DialogHeader>

                {/* FORM INPUT */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2 space-y-4">
                    <h4 className="text-sm font-bold text-gray-700">Tambah Jadwal Baru</h4>
                    <form onSubmit={handleAdd} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Dari Tanggal</Label>
                                <Input 
                                    type="date" 
                                    required
                                    value={form.start_date}
                                    onChange={e => setForm({...form, start_date: e.target.value})}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Sampai Tanggal</Label>
                                <Input 
                                    type="date" 
                                    required
                                    value={form.end_date}
                                    onChange={e => setForm({...form, end_date: e.target.value})}
                                    className="bg-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Keterangan / Alasan</Label>
                            <Input 
                                placeholder="Cth: Perbaikan Ring, Libur Lebaran" 
                                required
                                value={form.keterangan}
                                onChange={e => setForm({...form, keterangan: e.target.value})}
                                className="bg-white"
                            />
                        </div>
                        
                        {warningMsg && (
                            <div className="bg-yellow-50 text-yellow-700 text-xs p-2 rounded flex items-start gap-2 border border-yellow-200">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{warningMsg}</span>
                            </div>
                        )}

                        <div className="flex justify-end pt-1">
                            <Button type="submit" size="sm" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
                                {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                                Tambahkan Jadwal
                            </Button>
                        </div>
                    </form>
                </div>

                {/* LIST HISTORY */}
                <div className="mt-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Riwayat Jadwal Libur</h4>
                    <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[100px]">Mulai</TableHead>
                                    <TableHead className="w-[100px]">Selesai</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4 text-xs text-gray-500">Memuat...</TableCell>
                                    </TableRow>
                                ) : history.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4 text-xs text-gray-500">Belum ada jadwal libur.</TableCell>
                                    </TableRow>
                                ) : (
                                    history.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-xs">
                                                {format(new Date(item.start_date), 'dd MMM yyyy', { locale: localeId })}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {format(new Date(item.end_date), 'dd MMM yyyy', { locale: localeId })}
                                            </TableCell>
                                            <TableCell className="text-xs font-medium">{item.keterangan}</TableCell>
                                            <TableCell>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}