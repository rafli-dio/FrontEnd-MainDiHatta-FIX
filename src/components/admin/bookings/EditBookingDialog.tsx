'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, Save, CalendarClock, Info, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
    const [allBookings, setAllBookings] = useState<Booking[]>([]); 
    const [maintenances, setMaintenances] = useState<any[]>([]); 
    
    const [formData, setFormData] = useState({
        tanggal_booking: '',
        jam_mulai: '',
        durasi_jam: 1,
        lapangan_id: '' 
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!open) return;
            try {
                const [resLap, resBook, resMaint] = await Promise.all([
                    axios.get('/api/lapangans'),
                    axios.get('/api/bookings'),
                    axios.get('/api/public/maintenances').catch(() => ({ data: [] }))
                ]);
                
                const dataLap = resLap.data?.data || resLap.data;
                if (Array.isArray(dataLap)) setLapangans(dataLap);

                const dataBook = resBook.data?.data || resBook.data;
                if (Array.isArray(dataBook)) setAllBookings(dataBook);

                const dataMaint = resMaint.data?.data || resMaint.data || [];
                if (Array.isArray(dataMaint)) setMaintenances(dataMaint);
            } catch (error) {
                console.error("Gagal load data", error);
            }
        };
        fetchData();
    }, [open]);

    // 2. Isi Form saat Booking Terpilih
    useEffect(() => {
        if (booking && open) {
            setFormData({
                tanggal_booking: booking.tanggal_booking,
                jam_mulai: booking.jam_mulai ? booking.jam_mulai.substring(0, 5) : '',
                durasi_jam: Number(booking.durasi_jam) || 1,
                lapangan_id: String(booking.lapangan_id)
            });
        }
    }, [booking, open]);

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            setFormData({ ...formData, tanggal_booking: format(date, 'yyyy-MM-dd') });
        }
    };

    
    const bookingsOnDate = allBookings.filter(b => 
        b.lapangan_id === Number(formData.lapangan_id) && 
        b.tanggal_booking === formData.tanggal_booking &&
        b.id !== booking?.id &&
        ![4, 6].includes(b.status_booking_id) 
    );

    const selectedLapangan = lapangans.find(l => l.id === Number(formData.lapangan_id));
    const jamBuka = selectedLapangan?.jam_buka ? parseInt(selectedLapangan.jam_buka.substring(0, 2)) : 8;
    const jamTutup = selectedLapangan?.jam_tutup ? parseInt(selectedLapangan.jam_tutup.substring(0, 2)) : 23;

    const timeSlots = [];
    for (let i = jamBuka; i < jamTutup; i++) {
        const timeString = `${i.toString().padStart(2, '0')}:00`;
        
        const isBooked = bookingsOnDate.some(b => {
            const startHour = parseInt(b.jam_mulai.substring(0, 2));
            const endHour = parseInt(b.jam_selesai.substring(0, 2));
            return i >= startHour && i < endHour;
        });

        timeSlots.push({ time: timeString, isBooked });
    }

    const isDateUnderMaintenance = (date: Date) => {
        if (!maintenances.length) return false;
        const dateStr = format(date, 'yyyy-MM-dd');
        const lapId = Number(formData.lapangan_id);
        return maintenances.some((m: any) => {
            const active = m.is_active === true || m.is_active === 1 || m.is_active === '1';
            if (!active) return false;
            if (m.lapangan_id && Number(m.lapangan_id) !== lapId) return false;
            const start = m.start_date ? String(m.start_date).substring(0, 10) : '';
            const end = m.end_date ? String(m.end_date).substring(0, 10) : '';
            return dateStr >= start && dateStr <= end;
        });
    };

    const handleSave = async () => {
        if (!booking) return;
        setIsLoading(true);

        try {
            await axios.put(`/api/bookings/${booking.id}`, {
                ...formData,
                durasi_jam: Number(formData.durasi_jam),
                lapangan_id: Number(formData.lapangan_id) 
            });
            
            toast.success("Reschedule Berhasil!", {
                description: "Jadwal booking telah diperbarui & notifikasi dikirim."
            });
            
            onSuccess(); 
            onOpenChange(false); 
            
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
                        Ubah jadwal main. Sistem akan mendisable jam yang sudah terbooking.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-5 py-4">
                    <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-600 space-y-1">
                        <p><strong>Kode:</strong> {booking.kode_booking}</p>
                        <p><strong>Nama:</strong> {booking.user?.name || booking.nama_pengirim}</p>
                        <p><strong>Lapangan:</strong> {booking.lapangan?.nama_lapangan || '-'}</p>
                    </div>

                    {/* Input Tanggal */}
                    <div className="grid gap-2">
                        <Label htmlFor="tanggal">Tanggal Baru</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal border-gray-300 bg-gray-50 h-12 rounded-lg hover:bg-gray-100",
                                        !formData.tanggal_booking && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.tanggal_booking ? (
                                        format(new Date(formData.tanggal_booking), "EEEE, dd MMMM yyyy", { locale: localeId })
                                    ) : (
                                        <span>Pilih tanggal baru</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white rounded-xl shadow-2xl border-none" align="start">
                                <div className="p-4 bg-white rounded-xl">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            formData.tanggal_booking ? new Date(formData.tanggal_booking) : undefined
                                        }
                                        onSelect={handleCalendarSelect}
                                        initialFocus
                                        disabled={[
                                            (date) => date < new Date(new Date().setHours(0, 0, 0, 0)),
                                            (date) => isDateUnderMaintenance(date),
                                        ]}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>

                        {formData.tanggal_booking && isDateUnderMaintenance(new Date(formData.tanggal_booking)) && (
                            <div className="mt-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                                <Info className="w-3.5 h-3.5" />
                                <span>Lapangan tutup pada tanggal ini (Maintenance).</span>
                            </div>
                        )}

                        {formData.tanggal_booking && bookingsOnDate.length > 0 && (
                            <div className="mt-2 p-3 bg-orange-50 border border-orange-100 rounded-md">
                                <p className="text-xs text-orange-800 font-semibold flex items-center mb-2">
                                    <Info className="w-3.5 h-3.5 mr-1" />
                                    Jadwal sudah terisi pada tanggal ini:
                                </p>
                                <ul className="text-xs text-orange-700 list-disc list-inside space-y-1">
                                    {bookingsOnDate.map(b => (
                                        <li key={b.id}>
                                            {b.jam_mulai.substring(0, 5)} - {b.jam_selesai.substring(0, 5)} 
                                            <span className="text-orange-500/80 italic ml-1">
                                                ({b.user?.name || b.nama_pengirim})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Jam Mulai</Label>
                            <Select 
                                value={formData.jam_mulai} 
                                onValueChange={(val) => setFormData({...formData, jam_mulai: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jam" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map((slot) => (
                                        <SelectItem 
                                            key={slot.time} 
                                            value={slot.time}
                                            disabled={slot.isBooked} 
                                            className={slot.isBooked ? "text-gray-400 bg-gray-50 focus:bg-gray-50 cursor-not-allowed" : ""}
                                        >
                                            {slot.time} {slot.isBooked && '(Penuh)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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