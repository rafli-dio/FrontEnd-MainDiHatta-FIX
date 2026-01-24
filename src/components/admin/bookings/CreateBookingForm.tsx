'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Calendar as CalendarIcon, CreditCard, User, Info, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useCreateBookingForm } from '@/hooks/admin/useCreateBookingForm';

export default function CreateBookingForm() {
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');

    const {
        isSaving,
        lapangans,
        users,
        paymentMethods,
        statuses,
        isManualBooking,
        setIsManualBooking,
        formData,
        setFormData,
        getJamSelesai,
        getEstimasiHarga,
        handleSubmit,
        getBookedDates,   
        isTimeSlotBooked, 
        maxDuration,  
        isTimePassed,    
    } = useCreateBookingForm();

    // --- 1. STATE JAM OPERASIONAL DINAMIS ---
    const [jamOperasional, setJamOperasional] = useState({ buka: 6, tutup: 23 });

    // --- 2. AUTO FILL TANGGAL DARI URL ---
    useEffect(() => {
        if (dateParam && !formData.tanggal_booking) {
            try {
                const [year, month, day] = dateParam.split('-').map(Number);
                const parsedDate = new Date(year, month - 1, day);
                if (!isNaN(parsedDate.getTime())) {
                    setFormData((prev: any) => ({ ...prev, tanggal_booking: parsedDate }));
                }
            } catch (error) {
                console.error('Failed to parse date from URL:', error);
            }
        }
    }, [dateParam]);

    // --- 3. UPDATE JAM OPERASIONAL SESUAI LAPANGAN ---
    useEffect(() => {
        if (formData.lapangan_id && lapangans.length > 0) {
            const selectedLap = lapangans.find(l => String(l.id) === formData.lapangan_id);
            if (selectedLap && selectedLap.jam_buka && selectedLap.jam_tutup) {
                const buka = parseInt(selectedLap.jam_buka.split(':')[0]);
                const tutup = parseInt(selectedLap.jam_tutup.split(':')[0]);
                setJamOperasional({ buka, tutup });
            }
        }
    }, [formData.lapangan_id, lapangans]);

    // Generate Opsi Jam
    const timeOptions = Array.from(
        { length: jamOperasional.tutup - jamOperasional.buka }, 
        (_, i) => {
            const hour = i + jamOperasional.buka; 
            return `${String(hour).padStart(2, '0')}:00`;
        }
    );

    const formatRupiah = (num: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const confirmedStatus = statuses.find(s => s.nama_status.toLowerCase() === 'terkonfirmasi');
    const confirmedStatusId = confirmedStatus ? String(confirmedStatus.id) : '3';

    // Auto set status Terkonfirmasi
    useEffect(() => {
        if (formData.status_booking_id === '1' || formData.status_booking_id === '') {
             setFormData((prev: any) => ({ ...prev, status_booking_id: confirmedStatusId }));
        }
    }, [confirmedStatusId, formData.status_booking_id, setFormData]);

    return (
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            
            {/* KARTU 1: INFO PENYEWA */}
            <Card>
                <CardHeader className="pb-3 border-b mb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="w-4 h-4" /> Informasi Penyewa
                        </CardTitle>
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border">
                            <Label htmlFor="mode-manual" className="text-xs cursor-pointer font-medium text-gray-600">
                                {isManualBooking ? 'Mode Tamu (Walk-in)' : 'Mode Member'}
                            </Label>
                            <Switch 
                                id="mode-manual" 
                                checked={isManualBooking} 
                                onCheckedChange={setIsManualBooking} 
                            />
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isManualBooking ? (
                        <div className="space-y-2">
                            <Label>Nama Pelanggan (Manual) <span className="text-red-500">*</span></Label>
                            <Input 
                                placeholder="Cth: Pak Budi (Umum)" 
                                value={formData.nama_pengirim} 
                                onChange={(e) => setFormData({ ...formData, nama_pengirim: e.target.value })} 
                                className="bg-yellow-50 border-yellow-200 focus:border-yellow-400"
                            />
                            <p className="text-[10px] text-gray-500">Nama ini akan dicatat sebagai penyewa.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>Pilih Member <span className="text-red-500">*</span></Label>
                            <Select 
                                value={formData.user_id ? String(formData.user_id) : undefined}
                                onValueChange={(v) => setFormData({ ...formData, user_id: v })}
                            >
                                <SelectTrigger><SelectValue placeholder="Cari nama member..." /></SelectTrigger>
                                <SelectContent>
                                    {users.map(u => (
                                        <SelectItem key={u.id} value={u.id.toString()}>{u.name} ({u.nomor_telepon || '-'})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-gray-500">
                                <Link href="/admin/users" className="text-blue-600 hover:underline">Tambah User Baru</Link> jika belum terdaftar.
                            </p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Nama Kegiatan / Club</Label>
                        <Input 
                            placeholder="Cth: Latihan Rutin, Turnamen Kecil" 
                            value={formData.acara} 
                            onChange={(e) => setFormData({ ...formData, acara: e.target.value })} 
                        />
                    </div>
                </CardContent>
            </Card>

            {/* KARTU 2: JADWAL MAIN */}
            <Card>
                <CardHeader className="pb-3 border-b mb-4">
                    <CardTitle className="text-base flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Jadwal Main</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Pilih Lapangan <span className="text-red-500">*</span></Label>
                            <Select value={formData.lapangan_id} onValueChange={(v) => setFormData({ ...formData, lapangan_id: v })}>
                                <SelectTrigger><SelectValue placeholder="Pilih Lapangan" /></SelectTrigger>
                                <SelectContent>
                                    {lapangans.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.nama_lapangan}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Tanggal Main <span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.tanggal_booking && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.tanggal_booking ? format(formData.tanggal_booking, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.tanggal_booking}
                                        onSelect={(date) => setFormData({ ...formData, tanggal_booking: date })}
                                        initialFocus
                                        // --- PERBAIKAN: DISABLE TANGGAL LEWAT ---
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        modifiers={{ booked: getBookedDates() }}
                                        modifiersStyles={{ booked: { textDecoration: 'underline', color: '#D93F21', fontWeight: 'bold' } }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Jam Mulai <span className="text-red-500">*</span></Label>
                                {formData.lapangan_id && (
                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        Buka: {jamOperasional.buka}:00 - {jamOperasional.tutup}:00
                                    </span>
                                )}
                            </div>
                            
                            <Select 
                                value={formData.jam_mulai} 
                                onValueChange={(v) => setFormData({ ...formData, jam_mulai: v })} 
                                disabled={!formData.tanggal_booking || !formData.lapangan_id}
                            >
                                <SelectTrigger><SelectValue placeholder="Pilih Jam" /></SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {timeOptions.length > 0 ? (
                                        timeOptions.map((time) => {
                                            const isBooked = isTimeSlotBooked(time);
                                            const isPassed = isTimePassed(time);
                                            const isDisabled = isBooked || isPassed;
                                            return (
                                                <SelectItem 
                                                    key={time} 
                                                    value={time}
                                                    disabled={isDisabled} 
                                                    className={isDisabled ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-50" : ""}
                                                >
                                                    {time} 
                                                    {isBooked && " (Terisi)"}
                                                    {isPassed && !isBooked && " (Lewat)"}
                                                </SelectItem>
                                            );
                                        })
                                    ) : (
                                        <div className="p-2 text-sm text-gray-500 text-center">Pilih lapangan dahulu</div>
                                    )}
                                </SelectContent>
                            </Select>
                            {!formData.tanggal_booking && <p className="text-xs text-muted-foreground">Pilih tanggal & lapangan dulu.</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Durasi (Jam)</Label>
                                {formData.jam_mulai && (
                                    <span className="text-[10px] text-orange-600 font-bold">Max: {maxDuration} Jam</span>
                                )}
                            </div>
                            <Input 
                                type="number" 
                                min="1" 
                                max={maxDuration} 
                                value={formData.durasi_jam} 
                                onChange={e => {
                                    let val = parseInt(e.target.value);
                                    if(isNaN(val)) val = 1;
                                    if(val > maxDuration) val = maxDuration; 
                                    if(val < 1) val = 1;
                                    setFormData({ ...formData, durasi_jam: String(val) })
                                }} 
                                disabled={!formData.jam_mulai}
                            />
                            {parseInt(formData.durasi_jam) === maxDuration && formData.jam_mulai && (
                                <p className="text-[10px]  italic text-red-500">
                                    * Mentok karena ada booking lain atau jam tutup.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Jam Selesai (Est)</Label>
                            <Input value={getJamSelesai()} disabled className="bg-gray-100" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KARTU 3: PEMBAYARAN */}
            <Card className="border-l-4 border-l-[#D93F21]">
                <CardHeader className="pb-3 border-b mb-4">
                    <CardTitle className="text-base flex items-center gap-2"><CreditCard className="w-4 h-4" /> Pembayaran & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <span className="text-gray-600 font-medium">Total Harga Sewa</span>
                        <span className="text-2xl font-bold text-[#D93F21]">
                            {formatRupiah(getEstimasiHarga())}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Metode Pembayaran <span className="text-red-500">*</span></Label>
                                <Select 
                                    value={formData.payment_method_id ? String(formData.payment_method_id) : undefined}
                                    onValueChange={(v) => setFormData({ ...formData, payment_method_id: v })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Pilih Metode" /></SelectTrigger>
                                    <SelectContent>
                                        {paymentMethods.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.nama_metode}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Jumlah Bayar / DP (Rp)</Label>
                                <Input 
                                    type="text" 
                                    placeholder="0" 
                                    value={formData.jumlah_dp} 
                                    onChange={e => setFormData({ ...formData, jumlah_dp: e.target.value })} 
                                />
                                <p className="text-[10px] text-gray-500">Jika lunas, isi sesuai total tagihan.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status Booking <span className="text-red-500">*</span></Label>
                                <Select 
                                    value={formData.status_booking_id}
                                    onValueChange={(v) => setFormData({ ...formData, status_booking_id: v })}
                                    disabled={true} 
                                >
                                    <SelectTrigger className="font-bold text-green-700 bg-green-50 border-green-200">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={confirmedStatusId}>
                                            {confirmedStatus ? confirmedStatus.nama_status : 'Terkonfirmasi'}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-2 items-start bg-yellow-50 p-2 rounded text-[11px] text-yellow-700 mt-1">
                                    <Info className="w-3 h-3 mt-0.5" />
                                    <p>Booking manual otomatis dianggap <b>"Terkonfirmasi"</b> agar tercatat di Laporan Keuangan.</p>
                                </div>
                            </div>
                            
                             <div className="space-y-2">
                                 <Label>Asal Bank / Keterangan (Opsional)</Label>
                                 <Input 
                                    placeholder="Cth: Cash Tunai"
                                    value={formData.asal_bank}
                                    onChange={e => setFormData({ ...formData, asal_bank: e.target.value })}
                                 />
                             </div>
                        </div>
                    </div>

                    {/* INPUT UPLOAD BUKTI */}
                    <div className="space-y-2">
                        <Label>Upload Bukti (Opsional)</Label>
                        <div className="relative">
                            <Input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setFormData({ ...formData, bukti_pembayaran: e.target.files[0] });
                                    }
                                }}
                                className="pl-10 cursor-pointer"
                            />
                            <ImageIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Link href="/admin/bookings">
                    <Button 
                        variant="outline" 
                        type="button"
                        className="h-12 px-8 text-base font-semibold"
                    >
                        Batal
                    </Button>
                </Link>
                
                <Button 
                    type="submit" 
                    disabled={isSaving} 
                    className="bg-[#D93F21] hover:bg-[#b9351b] h-12 px-8 text-base font-bold shadow-md"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Simpan Booking
                </Button>
            </div>
        </form>
    );
}