'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios'; 
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight, Info, Clock, X, AlertTriangle } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Booking } from '@/types';

interface CalendarSectionProps {
    bookings: Booking[];
}

export default function CalendarSection({ bookings }: CalendarSectionProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    
    const [maintenanceDates, setMaintenanceDates] = useState<{ from: Date; to: Date; keterangan: string }[]>([]);

    const safeBookings = Array.isArray(bookings) ? bookings : [];

    useEffect(() => {
        const fetchMaintenance = async () => {
            try {
                const res = await axios.get('/api/public/maintenances');
                const data = res.data?.data || [];
                
                const ranges = data.map((m: any) => ({
                    from: new Date(m.start_date),
                    to: new Date(m.end_date),
                    keterangan: m.keterangan 
                }));
                setMaintenanceDates(ranges);
            } catch (error) {
                console.error("Gagal load maintenance:", error);
            }
        };
        fetchMaintenance();
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); 
        return { daysInMonth, firstDay };
    };

    const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
    
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const formatDateKey = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const todayStr = formatDateKey(today);

    const getBookingsForDate = (dateString: string) => {
        return safeBookings.filter(b => b?.tanggal_booking === dateString && b?.status_booking_id !== 4);
    };

    const checkDateStatus = (day: number) => {
        const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        dateObj.setHours(0, 0, 0, 0); 
        
        const dateStr = formatDateKey(dateObj);
        const isPast = dateObj < today;
        
        const maintenanceInfo = maintenanceDates.find(range => {
            const start = new Date(range.from); start.setHours(0,0,0,0);
            const end = new Date(range.to); end.setHours(23,59,59,999);
            return dateObj >= start && dateObj <= end;
        });

        const isMaintenance = !!maintenanceInfo;
        const maintenanceReason = maintenanceInfo?.keterangan || '';

        const count = getBookingsForDate(dateStr).length;
        const isBooked = count > 0;

        return { dateString: dateStr, isBooked, count, isPast, isMaintenance, maintenanceReason };
    };

    const handleDateClick = (dateString: string) => {
        if (selectedDate === dateString) {
            setSelectedDate(null); 
        } else {
            setSelectedDate(dateString); 
        }
    };

    const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];
    
    const selectedDateMaintenance = selectedDate ? maintenanceDates.find(range => {
        const d = new Date(selectedDate); d.setHours(0,0,0,0);
        const start = new Date(range.from); start.setHours(0,0,0,0);
        const end = new Date(range.to); end.setHours(23,59,59,999);
        return d >= start && d <= end;
    }) : null;

    return (
        <section id="booking" className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <span className="text-[#D93F21] font-bold uppercase tracking-widest text-xs bg-[#D93F21]/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full inline-block">
                        Jadwal & Ketersediaan
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 md:mt-6 mb-3 md:mb-4">
                        Pilih Waktu Mainmu!
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
                        Hijau = Kosong, Merah = Ada Isi, <span className="font-bold text-gray-400">Abu-abu = Tutup/Lewat</span>.
                    </p>
                </div>

                <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center p-4 sm:p-6 md:p-8 bg-gray-50/50 border-b border-gray-100">
                        <button onClick={prevMonth} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#D93F21] hover:border-[#D93F21] transition-all shadow-sm">
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight capitalize">
                            {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={nextMonth} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#D93F21] hover:border-[#D93F21] transition-all shadow-sm">
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="grid grid-cols-7 mb-4 md:mb-6 text-center">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, index) => (
                                <div key={day} className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${index === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-4">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-12 sm:h-14 md:h-24"></div>
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const { dateString, isBooked, isPast, isMaintenance, maintenanceReason } = checkDateStatus(day);
                                const isSelected = selectedDate === dateString;
                                const isToday = dateString === todayStr;

                                const isDisabled = isPast || isMaintenance;

                                return (
                                    <button
                                        key={day}
                                        onClick={() => !isPast && handleDateClick(dateString)}
                                        disabled={isPast} 
                                        className={`
                                            relative h-12 sm:h-14 md:h-24 rounded-lg sm:rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 group text-center
                                            ${isPast 
                                                ? 'bg-gray-50 border-transparent text-gray-300 cursor-not-allowed'
                                                : isMaintenance
                                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-80' // Style Maintenance
                                                : isSelected
                                                    ? 'bg-[#D93F21] border-[#D93F21] text-white shadow-lg shadow-orange-200 transform scale-105 z-10'
                                                    : isToday
                                                        ? 'bg-white border-[#D93F21] text-[#D93F21] shadow-md ring-2 sm:ring-4 ring-orange-50'
                                                        : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                            }
                                        `}
                                        title={isMaintenance ? `Tutup: ${maintenanceReason}` : ''}
                                    >
                                        <span className={`text-sm sm:text-lg md:text-2xl ${isSelected || isToday ? 'font-bold' : 'font-medium'} ${isMaintenance ? 'line-through decoration-2' : ''}`}>
                                            {day}
                                        </span>
                                        
                                        {isToday && !isSelected && !isMaintenance && (
                                            <span className="absolute -top-2 sm:-top-3 bg-[#D93F21] text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-sm">
                                                HARI INI
                                            </span>
                                        )}

                                        {isMaintenance && (
                                            <span className="absolute -top-2 sm:-top-3 bg-gray-500 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-sm">
                                                TUTUP
                                            </span>
                                        )}

                                        {!isPast && !isMaintenance && (
                                            <div className="flex gap-1 mt-0.5 sm:mt-1 md:mt-2">
                                                <div className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${isSelected ? 'bg-white/50' : isBooked ? 'bg-red-500' : 'bg-green-400'}`}></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Panel Informasi Bawah */}
                    {selectedDate && (
                        <div className="bg-gray-50 p-4 sm:p-6 md:p-8 border-t border-gray-100 animate-in slide-in-from-bottom-6 fade-in duration-500 relative">
                            
                            <button 
                                onClick={() => setSelectedDate(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
                                <div className="flex items-start gap-3 sm:gap-5 flex-1 w-full">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center shadow-sm flex-shrink-0 ${selectedDateMaintenance ? 'bg-gray-200 border-gray-300 text-gray-500' : 'bg-white border-gray-200 text-[#D93F21]'}`}>
                                        {selectedDateMaintenance ? <AlertTriangle className="w-6 h-6" /> : <CalendarIcon className="w-6 h-6" />}
                                    </div>
                                    <div className="w-full">
                                        <p className="text-xs sm:text-sm text-gray-500 uppercase font-bold tracking-wide">Tanggal Terpilih</p>
                                        <h4 className={`text-lg sm:text-2xl font-extrabold mt-1 capitalize mb-3 ${selectedDateMaintenance ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                            {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </h4>
                                        
                                        {/* KONDISI TAMPILAN MAINTENANCE VS BOOKING */}
                                        {selectedDateMaintenance ? (
                                            <div className="bg-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-300 text-gray-700 text-xs sm:text-sm flex items-center gap-2">
                                                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="font-semibold">MAAF, LAPANGAN TUTUP: {selectedDateMaintenance.keterangan}</span>
                                            </div>
                                        ) : (
                                            <>
                                                {selectedDateBookings.length > 0 ? (
                                                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-red-100 shadow-sm">
                                                        <p className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2 sm:mb-3">
                                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" /> Jam yang sudah terisi:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                            {selectedDateBookings.map((booking) => (
                                                                <span key={booking.id} className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                                    {booking.jam_mulai.substring(0, 5)} - {booking.jam_selesai.substring(0, 5)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-100 text-green-700 text-xs sm:text-sm flex items-center gap-2">
                                                        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        <span>Belum ada jadwal terisi. Semua jam tersedia!</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {!selectedDateMaintenance && (
                                    <Link href={`/pelanggan/booking/create?date=${selectedDate}`} className="w-full md:w-auto flex-shrink-0">
                                        <Button className="w-full mt-4 md:mt-0 md:w-auto bg-gradient-to-r from-[#D93F21] to-[#FF6B35] hover:from-[#b9351b] hover:to-[#E55A25] text-white px-4 sm:px-8 py-3 sm:py-4 md:py-7 rounded-lg md:rounded-2xl text-base md:text-lg font-bold shadow-md md:shadow-xl shadow-orange-100 md:shadow-orange-200 transition-all hover:scale-105 active:scale-95">
                                            Lanjut Booking <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}