'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
    return (
        <section id="about" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="w-full md:w-1/2 relative h-[350px] sm:h-[450px] md:h-[500px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <Image 
                        src="/images/bg-section-description.png" 
                        alt="Basketball Match"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 bg-white/95 backdrop-blur p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <p className="font-bold text-gray-900 text-base sm:text-lg">Lapangan Standar FIBA</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Kualitas lantai kayu terbaik & lampu terang</p>
                            </div>
                            <div className="bg-[#111] text-white p-2 sm:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
                    <div>
                        <span className="text-[#D93F21] font-bold uppercase tracking-widest text-xs bg-[#D93F21]/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full inline-block">About Us</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 md:mt-6 leading-tight">
                            Lapangan Impian.<br/>Booking Gampang.<br/>Langsung Main.
                        </h2>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                        Tidak perlu lagi repot telepon sana-sini atau datang langsung hanya untuk cek jadwal. 
                        MainDiHatta hadir sebagai solusi modern untuk komunitas basket di Wonogiri.
                    </p>

                    <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-gray-200">
                        <div>
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D93F21]">200+</h4>
                            <span className="text-gray-500 text-xs sm:text-sm font-medium mt-1 block">Active Members</span>
                        </div>
                        <div>
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D93F21]">500+</h4>
                            <span className="text-gray-500 text-xs sm:text-sm font-medium mt-1 block">Matches Played</span>
                        </div>
                        <div>
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D93F21]">24/7</h4>
                            <span className="text-gray-500 text-xs sm:text-sm font-medium mt-1 block">Support System</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}