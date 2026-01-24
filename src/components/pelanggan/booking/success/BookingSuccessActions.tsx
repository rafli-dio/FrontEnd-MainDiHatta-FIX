'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Printer, MessageCircle } from 'lucide-react'; 

interface BookingSuccessActionsProps {
    onPrint: () => void;
    userName: string;
    bookingCode: string; 
    playDate: string;   
}

export default function BookingSuccessActions({ 
    onPrint, 
    userName, 
    bookingCode, 
    playDate 
}: BookingSuccessActionsProps) {
    
    const adminPhoneNumber = "6282135449277"; 
    const message = `Halo Admin, saya ingin konfirmasi pesanan saya.

Nama: *${userName}*
Kode Booking: *${bookingCode}*
Tanggal Main: *${playDate}*

Mohon diproses, terima kasih.`;
    
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col gap-3 print:hidden">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-lg h-12 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Konfirmasi ke Admin
                </Button>
            </Link>

            <Link href="/pelanggan/home" className="w-full">
                <Button className="w-full bg-[#D93F21] hover:bg-[#b9351b] font-bold text-lg h-12 rounded-xl shadow-lg shadow-orange-100">
                    Kembali ke Home
                </Button>
            </Link>
        </div>
    );
}