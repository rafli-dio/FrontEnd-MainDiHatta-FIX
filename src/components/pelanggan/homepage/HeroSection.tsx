'use client';

import { useState } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { MapPin, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Booking } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HeroSectionProps {
    bookings?: Booking[];
}

export default function HeroSection({ bookings = [] }: HeroSectionProps) {
    const router = useRouter();
    
    // PERBAIKAN: Gunakan format(new Date(), ...) agar sesuai waktu lokal (WIB/WITA/WIT)
    // toISOString() menggunakan UTC, yang bisa menyebabkan tanggal mundur 1 hari jika dibuka pagi hari.
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Ambil daftar tanggal yang sudah dibooking (hanya yang belum lewat)
    const bookedDates = bookings
        .filter(b => {
            const bookingDate = new Date(b.tanggal_booking);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return bookingDate >= today;
        })
        .map(b => new Date(b.tanggal_booking));

    const handleSearchSchedule = () => {
        router.push(`/pelanggan/booking/create?date=${selectedDate}`);
    };

    return (
        <section className="relative h-[480px] md:h-[700px] flex items-center bg-black overflow-hidden mx-2 sm:mx-4 md:mx-12 mt-4 md:mt-6 rounded-2xl md:rounded-[2.5rem] shadow-2xl group">
            
            {/* Background Image & Animated Elements */}
            <div className="absolute inset-0 z-0 bg-black overflow-hidden">
                {/* Image */}
                <Image 
                    src="/images/jumbotron-bg.png" 
                    alt="Hero Basketball"
                    fill
                    className="object-cover opacity-60 transition-transform duration-[20s] group-hover:scale-110" 
                    priority
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-black/10 z-10"></div>
                
                {/* Animated Glowing Orbs */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] bg-[#D93F21] rounded-full mix-blend-screen blur-[100px] opacity-40 animate-float"></div>
                    <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[80%] bg-[#FF6B35] rounded-full mix-blend-screen blur-[120px] opacity-40 animate-float-delayed"></div>
                    <div className="absolute top-[30%] -right-[10%] w-[50%] h-[60%] bg-orange-400 rounded-full mix-blend-screen blur-[100px] opacity-30 animate-pulse-slow"></div>
                </div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-[20%] left-[15%] w-3 h-3 rounded-full bg-orange-500 opacity-60 blur-[1px] animate-float"></div>
                    <div className="absolute top-[70%] left-[25%] w-5 h-5 rounded-full bg-[#D93F21] opacity-50 blur-[2px] animate-float-delayed"></div>
                    <div className="absolute top-[30%] right-[10%] w-4 h-4 rounded-full bg-orange-400 opacity-70 blur-[1px] animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
                    <div className="absolute bottom-[20%] right-[5%] w-2 h-2 rounded-full bg-white opacity-50 blur-[1px] animate-float-delayed" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute top-[60%] right-[15%] w-3 h-3 rounded-full bg-orange-300 opacity-60 blur-[1px] animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-4 sm:px-6 md:px-16 w-full flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10 h-full">
                
                {/* Teks Hero */}
                <div className="w-full lg:w-1/2 h-full lg:h-auto flex flex-col justify-center lg:block pt-0 lg:pt-0 max-w-2xl space-y-4 md:space-y-8">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                        Pesan Lapangan <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93F21] to-orange-500">Basket</span> <span className="hidden sm:inline">Tanpa</span> <br/>
                        <span className="sm:hidden">Tanpa</span> Hambatan.
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed font-light">
                        Dapatkan kemudahan dan kepastian dalam mereservasi lapangan basket berkualitas tinggi secara online.
                    </p>
                    
                    {/* Mobile CTA Button */}
                    <div className="block lg:hidden w-full pt-4">
                        <Link href="/pelanggan/booking/create">
                            <Button className="w-full bg-gradient-to-r from-[#D93F21] to-[#FF6B35] hover:from-[#b9351b] hover:to-[#E55A25] h-12 rounded-xl font-bold text-white text-base shadow-lg">
                                Mulai Booking <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mini Form Card - Desktop Only */}
                <div className="hidden lg:block w-[400px] bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 shadow-2xl transform transition-transform duration-500 hover:-translate-y-2">
                    <h3 className="font-bold text-white text-xl mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                        Booking Lapangan Basket Anda!
                    </h3>
                    
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-300 uppercase font-bold tracking-wider ml-1">Lokasi</label>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-white cursor-default">
                                <div className="p-2 bg-[#D93F21]/20 rounded-lg">
                                    <MapPin className="w-5 h-5 text-[#D93F21]" />
                                </div>
                                <span className="font-medium">Hatta Sport Center</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-300 uppercase font-bold tracking-wider ml-1">Tanggal Main</label>
                            
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <div className="relative bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-white group hover:border-[#D93F21]/50 transition-colors focus-within:border-[#D93F21] cursor-pointer">
                                        <div className="p-2 bg-[#D93F21]/20 rounded-lg group-hover:bg-[#D93F21] transition-colors pointer-events-none z-10">
                                            <CalendarIcon className="w-5 h-5 text-[#D93F21] group-hover:text-white" />
                                        </div>
                                        
                                        {/* Tampilan Text */}
                                        <span className="font-medium flex-1 pointer-events-none text-left">
                                            {selectedDate ? format(new Date(selectedDate), 'dd MMMM yyyy', { locale: id }) : 'Pilih Tanggal'}
                                        </span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 z-[100000] border-gray-200 bg-white text-slate-900 drop-shadow-xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate ? new Date(selectedDate) : undefined}
                                        onSelect={(date) => {
                                            if (date) setSelectedDate(format(date, 'yyyy-MM-dd'));
                                            setIsCalendarOpen(false);
                                        }}
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            return date < today;
                                        }}
                                        modifiers={{ booked: bookedDates }}
                                        modifiersClassNames={{ 
                                            booked: "font-bold text-[#D93F21]" 
                                        }}
                                        initialFocus
                                        className="bg-white text-slate-900 rounded-xl border border-gray-200"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="pt-2">
                            <Button 
                                onClick={handleSearchSchedule}
                                className="w-full bg-[#D93F21] hover:bg-[#b9351b] h-14 rounded-2xl font-bold text-white text-lg shadow-lg transition-all active:scale-95"
                            >
                                Cari Jadwal
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}