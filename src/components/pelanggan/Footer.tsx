'use client';

import Link from 'next/link';
import { MapPin, User } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm mb-20">
                <div className="col-span-1 md:col-span-1">
                    <div className="text-3xl font-bold text-gray-900 mb-6">
                        MainDi<span className="text-[#D93F21]">Hatta</span>.id
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-8 text-base">
                        Platform booking lapangan basket Hatta Sport Center.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons */}
                        <div className="w-10 h-10 bg-[#D93F21] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#D93F21]/30 cursor-pointer hover:scale-110 transition">
                            <span className="font-bold">FB</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#D93F21] hover:text-white transition cursor-pointer">
                            <span className="font-bold">IG</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#D93F21] hover:text-white transition cursor-pointer">
                            <span className="font-bold">WA</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-6 text-lg">Layanan</h4>
                    <ul className="space-y-4 text-gray-500 text-base">
                        <li><Link href="#" className="hover:text-[#D93F21] transition-colors">Booking Lapangan</Link></li>
                        <li><Link href="#" className="hover:text-[#D93F21] transition-colors">Member Membership</Link></li>
                        <li><Link href="#" className="hover:text-[#D93F21] transition-colors">Event Organizer</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-6 text-lg">Perusahaan</h4>
                    <ul className="space-y-4 text-gray-500 text-base">
                        <li><Link href="#" className="hover:text-[#D93F21] transition-colors">Tentang Kami</Link></li>
                        <li><Link href="#" className="hover:text-[#D93F21] transition-colors">Kebijakan Privasi</Link></li>
                        <li><Link href="#" className="hover:text-[#D93F21] transition-colors">Syarat & Ketentuan</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-6 text-lg">Kontak</h4>
                    <ul className="space-y-4 text-gray-500 text-base">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#D93F21] shrink-0 mt-1" />
                            <span>Jl. Rajawali Raya, RT.03/RW.II, Nilagraha, Gonilan, Kec. Kartasura, Kabupaten Sukoharjo, Jawa Tengah 57169</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <User className="w-5 h-5 text-[#D93F21] shrink-0" />
                            <span>0812-3456-7890 (Admin)</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-gray-200 pt-8 text-center text-gray-400 text-sm">
                &copy; 2025 MainDiHatta.id. All rights reserved.
            </div>
        </footer>
    );
}