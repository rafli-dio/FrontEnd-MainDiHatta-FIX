'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, Save, CalendarClock } from 'lucide-react';

// UI Components
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Booking, Lapangan } from '@/types'; 

interface EditBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking | null;
    onSuccess: () => void;
}

export default function EditBookingDialog({ 
    open, 
    onOpenChange, 
    booking, 
    onSuccess 
}: EditBookingDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [lapangans, setLapangans] = useState<Lapangan[]>([]);
    
    // State Form
    const [formData, setFormData] = useState({
        tanggal_booking: '',
        jam_mulai: '',
        durasi_jam: 1,
        lapangan_id: ''
    });

    // 1. Fetch Data Lapangan
    useEffect(() => {
        const fetchLapangans = async () => {
            try {
                const res = await axios.get('/api/lapangans');
                const data = res.data?.data || res.data;
                if (Array.isArray(data)) setLapangans(data);
            } catch (error) {
                console.error("Gagal load lapangan", error);
            }
        };
        fetchLapangans();
    }, []);

    // 2. Isi Form saat Booking Terpilih Berubah
    useEffect(() => {
        if (booking && open) {
            setFormData({
                tanggal_booking: booking.tanggal_booking,
                // Ambil 5 karakter pertama (HH:mm) dari format H:i:s
                jam_mulai: booking.jam_mulai ? booking.jam_mulai.substring(0, 5) : '',
                durasi_jam: Number(booking.durasi_jam) || 1,
                lapangan_id: String(booking.lapangan_id)
            });
        }
    }, [booking, open]);

    // 3. Handle Simpan Perubahan
    const handleSave = async () => {
        if (!booking) return;
        setIsLoading(true);

        try {
            // Panggil API Update (Reschedule Logic di Backend)
            await axios.put(`/api/bookings/${booking.id}`, {
                ...formData,
                durasi_jam: Number(formData.durasi_jam),
                lapangan_id: Number(formData.lapangan_id)
            });
            
            toast.success("Reschedule Berhasil!", {
                description: "Jadwal booking telah diperbarui & notifikasi dikirim."
            });
            
            onSuccess(); // Refresh tabel induk
            onOpenChange(false); // Tutup modal
            
        } catch (error: any) {
            const msg = error.response?.data?.message || "Gagal update";
            const errors = error.response?.data?.errors;
            
            if (errors?.jam_mulai) {
                toast.error("Gagal Reschedule", { description: errors.jam_mulai[0] }); 
            } else if (errors?.tanggal_booking) {
                toast.error("Gagal Reschedule", { description: errors.tanggal_booking[0] }); 
            } else {
                toast.error("Gagal", { description: msg });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-orange-600" />
                        Reschedule / Edit Booking
                    </DialogTitle>
                    <DialogDescription>
                        Ubah jadwal atau lapangan. Sistem akan mengecek bentrok secara otomatis.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-5 py-4">
                    {/* Info Pelanggan (Read Only) */}
                    <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-600 space-y-1">
                        <p><strong>Kode:</strong> {booking.kode_booking}</p>
                        <p><strong>Nama:</strong> {booking.user?.name || booking.nama_pengirim}</p>
                    </div>

                    {/* Input Tanggal */}
                    <div className="grid gap-2">
                        <Label htmlFor="tanggal">Tanggal Baru</Label>
                        <Input 
                            id="tanggal"
                            type="date" 
                            value={formData.tanggal_booking}
                            onChange={(e) => setFormData({...formData, tanggal_booking: e.target.value})}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Input Jam Mulai */}
                        <div className="grid gap-2">
                            <Label htmlFor="jam">Jam Mulai</Label>
                            <Input 
                                id="jam"
                                type="time" 
                                value={formData.jam_mulai}
                                onChange={(e) => setFormData({...formData, jam_mulai: e.target.value})}
                                required
                            />
                        </div>

                        {/* Input Durasi */}
                        <div className="grid gap-2">
                            <Label htmlFor="durasi">Durasi (Jam)</Label>
                            <Input 
                                id="durasi"
                                type="number" 
                                min={1}
                                max={12}
                                value={formData.durasi_jam}
                                onChange={(e) => setFormData({...formData, durasi_jam: parseInt(e.target.value)})}
                                required
                            />
                        </div>
                    </div>

                    {/* Input Lapangan */}
                    <div className="grid gap-2">
                        <Label>Pilih Lapangan</Label>
                        <Select 
                            value={formData.lapangan_id} 
                            onValueChange={(val) => setFormData({...formData, lapangan_id: val})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Lapangan" />
                            </SelectTrigger>
                            <SelectContent>
                                {lapangans.map((lap) => (
                                    <SelectItem key={lap.id} value={String(lap.id)}>
                                        {lap.nama_lapangan} 
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}