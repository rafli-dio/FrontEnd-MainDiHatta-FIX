'use client';

import { CheckCircle2 } from 'lucide-react';

export default function BookingSuccessHeader() {
    return (
        <>
            <div className="bg-[#D93F21] h-32 relative print:hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
                <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-1 shadow-lg">
                        <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-14 pb-8 px-6 md:px-8 text-center print:pt-4">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Booking Berhasil!</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Terima kasih, pesanan Anda sedang diverifikasi admin.
                </p>
            </div>
        </>
    );
}