'use client';

import Image from 'next/image';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types';
import { 
    CheckCircle, XCircle, Calendar, Clock, User, CreditCard, MapPin, 
    Info, AlertCircle, Ban, CheckSquare, Loader2, Wallet, Banknote
} from 'lucide-react';
import { useState } from 'react';

interface BookingDetailDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking | null;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    isProcessing: boolean;
    onRefresh?: () => void; 
}

export default function BookingDetailDialog({
    isOpen,
    onOpenChange,
    booking,
    onApprove,
    onReject,
    isProcessing,
    onRefresh
}: BookingDetailDialogProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    if (!booking) return null;

    const formatRupiah = (num: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    
    const formatDate = (dateString: string) => 
        new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const handleUpdateStatus = async (statusId: number, successMessage: string) => {
        setIsUpdatingStatus(true);
        try {
            await axios.patch(`/api/bookings/${booking.id}/status`, {
                status_booking_id: statusId
            });
            toast.success(successMessage);
            onOpenChange(false);
            if (onRefresh) onRefresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal update status.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Helper untuk cek apakah pembayaran tunai/cash
    const isCashPayment = booking.payment_method?.nama_metode.toLowerCase().includes('cash') || 
                          booking.payment_method?.nama_metode.toLowerCase().includes('tunai');

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <span>Booking <span className="font-mono text-gray-500">#{booking.kode_booking}</span></span>
                        
                        {booking.status_booking_id === 1 && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertCircle className="w-3 h-3 mr-1"/> Menunggu Pembayaran
                            </Badge>
                        )}
                        {booking.status_booking_id === 2 && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Clock className="w-3 h-3 mr-1"/> Menunggu Konfirmasi
                            </Badge>
                        )}
                        {booking.status_booking_id === 3 && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1"/> Terkonfirmasi
                            </Badge>
                        )}
                        {booking.status_booking_id === 4 && (
                            <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                                <Ban className="w-3 h-3 mr-1"/> Dibatalkan
                            </Badge>
                        )}
                        {booking.status_booking_id === 5 && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                                <CheckSquare className="w-3 h-3 mr-1"/> Selesai
                            </Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    
                    {/* KOLOM KIRI: Detail */}
                    <div className="space-y-6">
                        {/* Info Lapangan */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {booking.lapangan?.nama_lapangan}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1 ml-6">
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" /> {formatDate(booking.tanggal_booking)}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" /> {booking.jam_mulai} - {booking.jam_selesai} ({booking.durasi_jam} Jam)
                                </p>
                            </div>
                        </div>

                        {/* Info Pemesan */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-4 h-4" /> Data Pemesan
                            </h4>
                            <div className="text-sm text-gray-600 ml-6 space-y-1">
                                <p><span className="font-medium">Nama Akun:</span> {booking.user?.name}</p>
                                <p><span className="font-medium">Telp:</span> {booking.user?.nomor_telepon || '-'}</p>
                                <p><span className="font-medium">Nama Club:</span> {booking.acara || '-'}</p>
                            </div>
                        </div>

                         {/* Info Pembayaran */}
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Pembayaran
                            </h4>
                            <div className="text-sm text-gray-600 ml-6 space-y-1">
                                <p><span className="font-medium">Metode:</span> {booking.payment_method?.nama_metode}</p>
                                <p><span className="font-medium">Total Tagihan:</span> {formatRupiah(Number(booking.total_harga))}</p>
                                <p><span className="font-medium text-blue-600">DP Masuk:</span> {formatRupiah(Number(booking.jumlah_dp))}</p>
                                
                                {(!isCashPayment && (booking.asal_bank || booking.nama_pengirim)) && (
                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Info Transfer</p>
                                        <p className="text-xs">Bank Asal: <span className="font-medium text-gray-900">{booking.asal_bank || '-'}</span></p>
                                        <p className="text-xs">Pengirim: <span className="font-medium text-gray-900">{booking.nama_pengirim || '-'}</span></p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Bukti Pembayaran ATAU Info Cash */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-900 text-sm">
                            {isCashPayment ? 'Informasi Penerimaan' : 'Bukti Pembayaran'}
                        </h4>
                        
                        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] h-full ${isCashPayment ? 'bg-green-50/50 border-green-200' : 'bg-gray-50'}`}>
                            
                            {isCashPayment ? (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Banknote className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-lg">Pembayaran Tunai</h5>
                                        <p className="text-sm text-gray-500 max-w-[200px] mx-auto mt-1">
                                            Booking ini dibayar secara langsung di lokasi (Walk-in/Offline).
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm inline-block">
                                        <p className="text-xs text-gray-400 font-medium uppercase mb-1">Diterima Oleh Admin</p>
                                        <p className="text-sm font-bold text-gray-800">{booking.user?.name || 'Admin'}</p>
                                    </div>
                                </div>
                            ) : (
                                booking.bukti_pembayaran_url ? (
                                    <div className="relative w-full h-full min-h-[300px]">
                                        <Image 
                                            src={booking.bukti_pembayaran_url}
                                            alt="Bukti Bayar"
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                        <a 
                                            href={booking.bukti_pembayaran_url} 
                                            target="_blank" 
                                            className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded hover:bg-black/70"
                                        >
                                            Lihat Full
                                        </a>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm text-center flex flex-col items-center">
                                        <Info className="w-8 h-8 mb-2 opacity-20" />
                                        <p>Belum ada bukti pembayaran yang diupload.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 flex-wrap sm:flex-nowrap">
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>

                    {/* Jika status Menunggu Pembayaran (1), Admin bisa Batalkan atau Konfirmasi Manual */}
                    {booking.status_booking_id === 1 && (
                        <>
                            <Button 
                                variant="destructive" 
                                onClick={() => onReject(booking.id)} 
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                Batalkan Booking
                            </Button>
                            <Button 
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleUpdateStatus(3, "Pembayaran dikonfirmasi manual.")}
                                disabled={isUpdatingStatus}
                            >
                                {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                Konfirmasi Pembayaran
                            </Button>
                        </>
                    )}

                    {/* Jika status Menunggu Konfirmasi (2), Admin Approve/Reject */}
                    {booking.status_booking_id === 2 && (
                        <>
                            <Button 
                                variant="destructive" 
                                onClick={() => onReject(booking.id)} 
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                Tolak
                            </Button>
                            <Button 
                                className="bg-green-600 hover:bg-green-700" 
                                onClick={() => onApprove(booking.id)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                Konfirmasi
                            </Button>
                        </>
                    )}

                    {/* Jika status Terkonfirmasi (3), Admin bisa Batalkan (Refund/Emergency) atau Tandai Selesai */}
                    {booking.status_booking_id === 3 && (
                        <>
                            <Button 
                                variant="destructive" 
                                onClick={() => onReject(booking.id)} 
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                Batalkan
                            </Button>
                            <Button 
                                className="bg-gray-800 hover:bg-gray-900 text-white"
                                onClick={() => handleUpdateStatus(5, "Booking ditandai selesai.")}
                                disabled={isUpdatingStatus}
                            >
                                {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4 mr-2" />}
                                Tandai Selesai
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}