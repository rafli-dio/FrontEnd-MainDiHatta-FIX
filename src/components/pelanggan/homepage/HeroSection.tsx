'use client';

import { useState } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { MapPin, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns'; // Pastikan ini terimport

export default function HeroSection() {
    const router = useRouter();
    
    // PERBAIKAN: Gunakan format(new Date(), ...) agar sesuai waktu lokal (WIB/WITA/WIT)
    // toISOString() menggunakan UTC, yang bisa menyebabkan tanggal mundur 1 hari jika dibuka pagi hari.
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);

    const handleSearchSchedule = () => {
        router.push(`/pelanggan/booking/create?date=${selectedDate}`);
    };

    return (
        <section className="relative h-[480px] md:h-[700px] flex items-center bg-black overflow-hidden mx-2 sm:mx-4 md:mx-12 mt-4 md:mt-6 rounded-2xl md:rounded-[2.5rem] shadow-2xl group">
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/images/jumbotron-bg.png" 
                    alt="Hero Basketball"
                    fill
                    className="object-cover opacity-60 transition-transform duration-[20s] group-hover:scale-110" 
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>
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
                            <div className="relative bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-white group hover:border-[#D93F21]/50 transition-colors focus-within:border-[#D93F21]">
                                <div className="p-2 bg-[#D93F21]/20 rounded-lg group-hover:bg-[#D93F21] transition-colors pointer-events-none z-10">
                                    <CalendarIcon className="w-5 h-5 text-[#D93F21] group-hover:text-white" />
                                </div>
                                
                                {/* INPUT TANGGAL */}
                                <input 
                                    type="date"
                                    value={selectedDate}
                                    min={todayStr} // PERBAIKAN: min date juga menggunakan local time
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                
                                {/* Tampilan Text */}
                                <span className="font-medium flex-1">
                                    {selectedDate ? format(new Date(selectedDate), 'dd MMMM yyyy') : 'Pilih Tanggal'}
                                </span>
                            </div>
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