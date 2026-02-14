'use client';

import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar'; 
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Booking } from '@/types';

interface BookingWizardStep2Props {
    formData: any;
    setFormData: (data: any) => void;
    bookedDates: Date[];
    getJamSelesai: () => string;
    bookings?: Booking[];
    jamOperasional: { buka: number; tutup: number };
    
    // --- PROPS BARU DITAMBAHKAN ---
    maintenanceDates?: { from: Date; to: Date }[]; 
    maxDuration?: number;
}

export default function BookingWizardStep2({ 
    formData, 
    setFormData, 
    bookedDates = [],
    getJamSelesai, 
    bookings = [],
    jamOperasional = { buka: 8, tutup: 23 },
    
    // --- DEFAULTS ---
    maintenanceDates = [],
    maxDuration = 12
}: BookingWizardStep2Props) {
    
    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const safeBookedDates = Array.isArray(bookedDates) ? bookedDates : [];

    const totalSlots = jamOperasional.tutup - jamOperasional.buka;
    
    const timeSlots = Array.from({ length: totalSlots }, (_, i) => {
        const hour = i + jamOperasional.buka; 
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    // --- FUNGSI LAMA (getMaxDuration) DIHAPUS ---
    // Karena logika sudah dipindah ke hook useBookingWizard agar lebih aman

    const isTimePassed = (time: string) => {
        if (!formData.tanggal_booking) return false;

        const now = new Date();
        const selectedDate = new Date(formData.tanggal_booking);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
            const currentHour = now.getHours();
            const slotHour = parseInt(time.split(':')[0]);
            return slotHour <= currentHour;
        }
        return false;
    };

    const isSlotBooked = (time: string) => {
        if (!formData.tanggal_booking) return false;
        const dateStr = format(new Date(formData.tanggal_booking), 'yyyy-MM-dd');
        const slotHour = parseInt(time.split(':')[0]);

        return safeBookings.some(booking => {
            if (!booking?.tanggal_booking) return false; 

            const bookingDateStr = format(new Date(booking.tanggal_booking), 'yyyy-MM-dd');
            if (bookingDateStr !== dateStr || booking.status_booking_id === 4) return false;

            const startHour = parseInt(booking.jam_mulai.split(':')[0]);
            let endHour: number;

            if (booking.jam_selesai) {
                endHour = parseInt(booking.jam_selesai.split(':')[0]);
            } else if (booking.durasi_jam) {
                endHour = startHour + Number(booking.durasi_jam);
            } else {
                endHour = startHour + 1;
            }

            return slotHour >= startHour && slotHour < endHour;
        });
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setFormData({
                ...formData,
                tanggal_booking: date,
                jam_mulai: '',
                jam_selesai: '',
                durasi_jam: '1'
            });
        }
    };

    const handleTimeSelect = (time: string) => {
        setFormData({
            ...formData,
            jam_mulai: time,
            durasi_jam: '1'
        });
    };

    return (
        <div className="space-y-6 max-w-lg animate-in slide-in-from-right-4 duration-300">
            
            <div className="space-y-2">
                <Label>Tanggal Main</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal border-gray-300 bg-gray-50 h-12 rounded-lg hover:bg-gray-100",
                                !formData.tanggal_booking && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.tanggal_booking ? (
                                format(new Date(formData.tanggal_booking), "EEEE, dd MMMM yyyy", { locale: localeId })
                            ) : (
                                <span>Pilih tanggal main</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white rounded-xl shadow-2xl border-none" align="start">
                        <div className="p-4 bg-white rounded-xl">
                            <Calendar
                                mode="single"
                                selected={formData.tanggal_booking ? new Date(formData.tanggal_booking) : undefined}
                                onSelect={handleDateSelect}
                                initialFocus
                                
                                // --- VALIDASI TANGGAL ---
                                disabled={[
                                    // 1. Matikan tanggal lampau
                                    (date) => date < new Date(new Date().setHours(0, 0, 0, 0)),
                                    // 2. Matikan tanggal MAINTENANCE (Spread operator array)
                                    ...maintenanceDates
                                ]}
                                
                                modifiers={{ 
                                    booked: safeBookedDates, 
                                    maintenance: maintenanceDates 
                                }}
                                modifiersStyles={{ 
                                    booked: { color: '#D93F21', fontWeight: 'bold', textDecoration: 'underline' },
                                    maintenance: { color: '#9CA3AF', textDecoration: 'line-through', opacity: 0.5 }
                                }}
                                className="rounded-md border-none"
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* ALERT MAINTENANCE (Jika user memaksa input manual/bug) */}
            {maintenanceDates.some(range => {
                 if(!formData.tanggal_booking) return false;
                 const d = new Date(formData.tanggal_booking);
                 d.setHours(0,0,0,0);
                 const start = new Date(range.from); start.setHours(0,0,0,0);
                 const end = new Date(range.to); end.setHours(23,59,59,999);
                 return d >= start && d <= end;
            }) && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Maaf, lapangan tutup pada tanggal ini (Maintenance).</span>
                </div>
            )}

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label>Pilih Jam Mulai</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-full text-gray-500 font-medium">
                            Buka: {jamOperasional.buka}:00 - {jamOperasional.tutup}:00
                        </span>
                        {formData.tanggal_booking && (
                            <span className="text-xs text-gray-400">
                                {format(new Date(formData.tanggal_booking), "dd MMMM yyyy", { locale: localeId })}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {timeSlots.map((time) => {
                        const passed = isTimePassed(time);
                        const booked = isSlotBooked(time);
                        const disabled = passed || booked;
                        const isSelected = formData.jam_mulai === time;
                        
                        return (
                            <button
                                key={time}
                                type="button"
                                disabled={disabled}
                                onClick={() => !disabled && handleTimeSelect(time)}
                                className={cn(
                                    "py-2 px-1 rounded-lg border text-xs sm:text-sm font-medium transition-all flex flex-col items-center justify-center gap-0.5 min-h-[50px] relative overflow-hidden",
                                    booked 
                                        ? "bg-red-50 text-red-300 border-red-100 cursor-not-allowed opacity-70"
                                        : passed 
                                            ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
                                            : isSelected 
                                                ? "bg-[#D93F21] border-[#D93F21] text-white shadow-lg ring-2 ring-offset-1 ring-[#D93F21]"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-[#D93F21] hover:text-[#D93F21] hover:shadow-sm"
                                )}
                            >
                                <span className="z-10">{time}</span>
                                {booked && (
                                    <span className="text-[8px] font-bold uppercase text-red-400">Booked</span>
                                )}
                            </button>
                        );
                    })}
                </div>
                {!formData.tanggal_booking && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-md text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>Silakan pilih tanggal terlebih dahulu untuk melihat slot tersedia.</span>
                    </div>
                )}
            </div>

            {/* REKAP & DURASI */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500 uppercase">Jam Mulai</Label>
                        <div className="flex items-center gap-2 px-3 bg-white border border-gray-200 h-10 rounded-md text-gray-800 font-bold text-sm">
                            <Clock className="w-4 h-4 text-[#D93F21]" />
                            {formData.jam_mulai || '--:--'}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500 uppercase">Jam Selesai</Label>
                        <div className="flex items-center gap-2 px-3 bg-white border border-gray-200 h-10 rounded-md text-gray-500 text-sm">
                            {getJamSelesai()}
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <Label className="text-xs text-gray-500 uppercase">Durasi Main (Jam)</Label>
                        {formData.jam_mulai && (
                            <span className="text-[10px] text-[#D93F21] font-medium">
                                Maksimal {maxDuration} jam
                            </span>
                        )}
                    </div>
                    
                    <Input 
                        type="number" 
                        min="1" 
                        // --- PAKAI PROPS MAX DURATION ---
                        max={maxDuration}
                        className="bg-white border-gray-300 focus:border-[#D93F21]"
                        value={formData.durasi_jam}
                        onChange={e => {
                            const val = parseInt(e.target.value);
                            // Validasi input agar tidak melebihi maxDuration
                            if (val > maxDuration) {
                                setFormData({...formData, durasi_jam: maxDuration.toString()});
                            } else if (val < 1 && e.target.value !== '') {
                                // jangan update jika < 1
                            } else {
                                setFormData({...formData, durasi_jam: e.target.value});
                            }
                        }}
                    />
                    
                    {formData.jam_mulai && maxDuration < 5 && (
                        <p className="text-[10px] text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Durasi dibatasi karena ada booking lain atau lapangan tutup.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}