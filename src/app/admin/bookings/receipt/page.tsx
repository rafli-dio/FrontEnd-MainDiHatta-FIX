'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import axios from '@/lib/axios';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function ReceiptContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                // Try fetching booking details
                const res = await axios.get(`/api/bookings/${id}`);
                const data = res.data?.data || res.data;
                setBooking(data);
                
                // Auto print after a small delay to ensure rendering
                setTimeout(() => {
                    window.print();
                }, 500);
            } catch (error) {
                console.error("Failed to load booking for receipt", error);
                toast.error("Gagal memuat data struk.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBooking();
        } else {
            setLoading(false);
        }
    }, [id]);

    const formatRupiah = (num: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const calculateDuration = () => {
        if (!booking) return '-';
        if (booking.durasi_jam) return booking.durasi_jam;
        
        try {
            const [startHour, startMin] = booking.jam_mulai.split(':').map(Number);
            const [endHour, endMin] = booking.jam_selesai.split(':').map(Number);
            let duration = endHour - startHour + (endMin - startMin) / 60;
            if (duration < 0) duration += 24;
            return Math.round(duration * 100) / 100;
        } catch {
            return '-';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#D93F21]" />
                <p className="text-gray-500 mt-2 text-sm">Memuat struk...</p>
            </div>
        );
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            // Jika dibuka di tab baru, tutup tab atau redirect jika gagal
            window.close();
            setTimeout(() => {
                router.push('/admin/bookings');
            }, 300);
        }
    };

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 mb-4">Data tidak ditemukan.</p>
                <Button onClick={handleBack}>Kembali</Button>
            </div>
        );
    }

    const isCashPayment = booking.payment_method?.nama_metode.toLowerCase().includes('cash') ||
        booking.payment_method?.nama_metode.toLowerCase().includes('tunai');

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 print:py-0 print:bg-white">
            
            {/* Header / Actions - Hidden while printing */}
            <div className="w-full max-w-[320px] mb-6 flex justify-between print:hidden">
                <Button variant="outline" size="sm" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
                <Button size="sm" onClick={() => window.print()} className="bg-[#D93F21] hover:bg-[#b9351b]">
                    <Printer className="w-4 h-4 mr-2" /> Cetak
                </Button>
            </div>

            {/* Receipt Container - Looks like a traditional thermal receipt */}
            <div className="w-full max-w-[320px] bg-white p-4 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 font-mono text-xs text-black">
                
                {/* Store Header */}
                <div className="text-center mb-4 border-b border-dashed border-gray-400 pb-4">
                    <h1 className="text-lg font-bold mb-1">HATTA SPORT CENTER</h1>
                    <p>Jl. Rajawali Raya, RT.03/RW.II</p>
                    <p>Gonilan, Kec. Kartasura</p>
                    <p>Telp: 0811-2654-765</p>
                </div>

                {/* Receipt Info */}
                <div className="mb-4">
                    <div className="flex justify-between">
                        <span>Tgl Cetak:</span>
                        <span>{format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Kode:</span>
                        <span className="font-bold">{booking.kode_booking}</span>
                    </div>
                    {/* Jika ada informasi kasir */}
                </div>

                {/* Customer Info */}
                <div className="mb-4 border-t border-dashed border-gray-400 pt-2">
                    <div className="flex justify-between mt-1">
                        <span>Pelanggan:</span>
                        <span className="font-bold text-right truncate ml-2 max-w-[150px]">
                            {booking.nama_pengirim || booking.user?.name || '-'}
                        </span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>No. Telp:</span>
                        <span>{booking.user?.nomor_telepon || '-'}</span>
                    </div>
                </div>

                {/* Order Details */}
                <div className="mb-4 border-t border-b border-dashed border-gray-400 py-2">
                    <div className="font-bold mb-1">{booking.lapangan?.nama_lapangan}</div>
                    <div className="flex justify-between">
                        <span>Tgl Main:</span>
                        <span>{format(new Date(booking.tanggal_booking), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Waktu:</span>
                        <span>{booking.jam_mulai} - {booking.jam_selesai}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Durasi:</span>
                        <span>{calculateDuration()} Jam</span>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="mb-4 space-y-1">
                    <div className="flex justify-between">
                        <span>Metode Byr:</span>
                        <span>{booking.payment_method?.nama_metode || '-'}</span>
                    </div>
                    <div className="flex justify-between mt-1 pt-1 border-t border-gray-100">
                        <span>Total Harga:</span>
                        <span>{formatRupiah(Number(booking.total_harga))}</span>
                    </div>

                    {!isCashPayment && (
                        <div className="flex justify-between">
                            <span>Jml Bayar (DP):</span>
                            <span>{formatRupiah(Number(booking.jumlah_bayar || 0))}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-sm mt-2">
                        <span>Status:</span>
                        <span>{booking.status_booking?.nama_status || 'Terkonfirmasi'}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-dashed border-gray-400 mt-4">
                    <p className="font-bold mb-1">TERIMA KASIH</p>
                    <p className="text-[10px]">Silakan tunjukkan struk ini</p>
                    <p className="text-[10px]">kepada petugas lapangan.</p>
                </div>
                
            </div>
            
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { font-size: 12px; }
                }
            `}</style>
        </div>
    );
}

export default function ReceiptPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#D93F21]" />
                <p className="text-gray-500 mt-2 text-sm">Memuat struk...</p>
            </div>
        }>
            <ReceiptContent />
        </Suspense>
    );
}
