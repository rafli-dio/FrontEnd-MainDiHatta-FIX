'use client';

// 1. Import Suspense
import { Suspense, useEffect } from 'react'; 
import { useBookingSuccessPage } from '@/hooks/pelanggan/useBookingSuccessPage';
import BookingSuccessHeader from '@/components/pelanggan/booking/success/BookingSuccessHeader';
import BookingTicket from '@/components/pelanggan/booking/success/BookingTicket';
import BookingSuccessActions from '@/components/pelanggan/booking/success/BookingSuccessActions';

// 2. Ganti nama fungsi komponen utama ini menjadi 'BookingSuccessContent' (bukan export default lagi)
function BookingSuccessContent() {
    const { 
        booking, 
        loading, 
        bookingId, 
        formatDate, 
        handlePrint 
    } = useBookingSuccessPage();

    useEffect(() => {
        if (booking) {
            console.log("Cek Data untuk WA:", booking);
        }
    }, [booking]);

    if (!bookingId || loading) {
        return (
            <div className="min-h-screen from-[#D93F21] to-orange-500 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!booking) return null;

    const namaPemesan = booking?.user?.name || "Pelanggan";
    const kodeBooking = booking?.kode_booking || "-";
    
    const rawDate = booking?.tanggal_booking ? new Date(booking.tanggal_booking) : new Date();
    
    const tanggalMain = rawDate.toLocaleDateString('id-ID', {
        weekday: 'long', 
        day: 'numeric',   
        month: 'long',   
        year: 'numeric'   
    }); 

    return (
        <div className="min-h-screen from-[#D93F21] to-orange-500 py-12 px-4 flex justify-center items-start">
            <div className="max-w-lg w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-gray-100 print:shadow-none print:border-none">
                
                <BookingSuccessHeader />

                <BookingTicket 
                    booking={booking} 
                    formatDate={formatDate} 
                />

                <BookingSuccessActions 
                    onPrint={handlePrint} 
                    userName={namaPemesan}
                    bookingCode={kodeBooking}
                    playDate={tanggalMain}    
                />
            </div>
            
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .max-w-lg, .max-w-lg * { visibility: visible; }
                    .max-w-lg { position: absolute; top: 0; left: 0; width: 100%; box-shadow: none; border: none; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
}

// 3. Buat komponen wrapper baru sebagai Default Export
export default function BookingSuccessPage() {
    return (
        // Bungkus dengan Suspense agar Next.js melewati error prerender parameter URL
        <Suspense fallback={
            <div className="min-h-screen from-[#D93F21] to-orange-500 flex items-center justify-center">
                <div className="text-white">Memuat Data Transaksi...</div>
            </div>
        }>
            <BookingSuccessContent />
        </Suspense>
    );
}