'use client';

import { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card'; 
import { Badge } from '@/components/ui/badge';
import {
    Calendar, Clock, MapPin, CreditCard, Upload, Printer, Loader2, AlertTriangle, MessageCircle, CalendarClock, Wallet, XCircle, Ticket, Users
} from 'lucide-react';
import { formatRupiah, calculateDuration, getStatusConfig } from '@/lib/bookingUtils';

const ADMIN_PHONE = "6282135449277"; 

interface BookingCardProps {
    booking: Booking;
    formatDate: (date: string) => string;
    onUpload?: () => void;
    onCancel?: () => void;
    onPrint?: () => void;
    isHistory: boolean;
    isUploading?: boolean;
}

export default function BookingCard({
    booking,
    formatDate,
    onUpload,
    onCancel,
    onPrint,
    isHistory,
    isUploading = false
}: BookingCardProps) {
    
    const statusId = Number(booking.status_booking_id); 
    const durasi = calculateDuration(booking.jam_mulai, booking.jam_selesai);
    const statusConfig = getStatusConfig(statusId);

    // --- HELPER LOGIC ---
    const canReschedule = () => {
        if (isHistory) return false; 
        if (![2, 3].includes(statusId)) return false; 

        const mainDate = new Date(`${booking.tanggal_booking}T${booking.jam_mulai}`);
        const now = new Date();
        const diffInHours = (mainDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        return diffInHours > 24; 
    };

    // 1. Link WA untuk Maintenance (ID 6)
    const handleContactMaintenance = () => {
        const message = `Halo Admin Hatta Sport. 👋\n\nSaya ingin menanyakan perihal booking yang *Dibatalkan Admin (Maintenance)*.\n\nBerikut detail booking saya:\n🎫 Kode: *${booking.kode_booking}*\n👤 Nama: *${booking.user?.name || booking.nama_pengirim}*\n📅 Tanggal: ${booking.tanggal_booking}\n\nMohon bantuannya untuk proses *Refund* atau *Reschedule*. Terima kasih.`;
        window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // 2. Link WA untuk Ajukan Reschedule
    const handleReschedule = () => {
        const message = `Halo Admin. Saya ingin reschedule booking #${booking.kode_booking} (Tgl: ${booking.tanggal_booking}, Jam: ${booking.jam_mulai}). Mohon info slot pengganti.`;
        window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // 3. Link WA untuk Refund Manual (ID 4)
    const handleRequestRefund = () => {
        const message = `Halo Admin Hatta Sport. 👋\n\nSaya telah membatalkan booking (Full Payment) dengan detail:\n🎫 Kode: *${booking.kode_booking}*\n👤 Nama: *${booking.user?.name || booking.nama_pengirim}*\n💰 Total Dana Masuk: *${formatRupiah(Number(booking.jumlah_bayar || booking.total_harga))}*\n\nMohon diproses pengembalian dana (Refund) ke rekening saya:\n🏦 Bank: \n💳 No Rek: \n👤 a.n: \n\nTerima kasih.`;
        window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    };

    let borderClass = 'border-l-[#D93F21]';
    let iconBgClass = 'bg-orange-100 text-[#D93F21]';
    
    if (statusId === 6) {
        borderClass = 'border-l-red-600 bg-red-50/30'; 
        iconBgClass = 'bg-red-100 text-red-600';
    } else if (statusId === 4) {
        borderClass = 'border-l-orange-500 bg-orange-50/30'; 
        iconBgClass = 'bg-orange-100 text-orange-600';
    } else if (isHistory) {
        borderClass = 'border-l-gray-400 opacity-95';
        iconBgClass = 'bg-gray-100 text-gray-500';
    }

    const showCancel = [1, 2, 3].includes(statusId) && !isHistory;
    const showReschedule = canReschedule();
    const showUpload = statusId === 1 && !isHistory;
    const showPrint = statusId === 3 || statusId === 5;
    const hasFooterActions = showCancel || showReschedule || showUpload || showPrint;

    return (
        <Card className={`overflow-hidden border border-gray-200 border-l-4 ${borderClass} rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}>
            <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    <div className="flex-1 space-y-4">
                        
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-xs font-mono font-semibold">
                                <Ticket className="w-3.5 h-3.5 text-slate-400" />
                                {booking.kode_booking}
                            </div>
                            
                            {statusId === 6 ? (
                                <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 shadow-none px-2.5 py-1 text-[11px]">
                                    <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Dibatalkan Admin
                                </Badge>
                            ) : statusId === 4 ? (
                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 shadow-none px-2.5 py-1 text-[11px]">
                                    <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Dibatalkan
                                </Badge>
                            ) : (
                                <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} hover:${statusConfig.bgColor} shadow-none px-2.5 py-1 text-[11px] font-semibold tracking-wide`}>
                                    {statusConfig.label}
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-start gap-3.5">
                            <div className={`p-2.5 rounded-full shrink-0 ${iconBgClass}`}>
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 tracking-tight leading-tight">
                                    {booking.lapangan?.nama_lapangan || 'Lapangan Hatta Sport'}
                                </h3>
                                
                                <div className="mt-2.5 space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" /> 
                                        <span className="font-medium">{formatDate(booking.tanggal_booking)}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" /> 
                                        <span className="font-medium">{booking.jam_mulai} - {booking.jam_selesai}</span>
                                        <span className="ml-1.5 text-xs text-gray-400">({durasi} Jam)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {booking.acara && (
                            <div className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full mt-2">
                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                <span>Club: <strong className="text-gray-800">{booking.acara}</strong></span>
                            </div>
                        )}

                        {statusId === 6 && (
                            <div className="mt-4 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                                <p className="text-[13px] text-red-800 font-medium mb-3 leading-relaxed">
                                    ⚠️ <strong>Mohon Maaf.</strong> Booking dibatalkan karena maintenance lapangan mendadak. 
                                    Silakan hubungi admin untuk <strong>Refund</strong> atau <strong>Reschedule</strong>.
                                </p>
                                <Button onClick={handleContactMaintenance} size="sm" className="h-9 text-xs bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto shadow-sm">
                                    <MessageCircle className="w-4 h-4 mr-2" /> Hubungi Admin (WA)
                                </Button>
                            </div>
                        )}

                        {statusId === 4 && (Number(booking.jumlah_bayar) > 0 || booking.bukti_pembayaran) && (
                            <div className="mt-4 p-3.5 bg-orange-50 border border-orange-200 rounded-xl">
                                <p className="text-[13px] text-orange-800 font-medium mb-3 leading-relaxed">
                                    ℹ️ Booking dibatalkan. Anda telah membayar lunas <strong>{formatRupiah(Number(booking.jumlah_bayar || booking.total_harga))}</strong>. Silakan hubungi Admin untuk Refund.
                                </p>
                                <Button onClick={handleRequestRefund} size="sm" className="h-9 text-xs bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto shadow-sm">
                                    <Wallet className="w-4 h-4 mr-2" /> Ajukan Refund (WA)
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex md:flex-col justify-between items-center md:items-end bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-100 md:min-w-[200px] h-fit">
                        <div className="text-left md:text-right w-full">
                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Total Tagihan
                            </p>
                            <p className={`text-lg sm:text-2xl font-black tracking-tight ${(statusId === 6 || statusId === 4) ? 'text-gray-400 line-through' : 'text-[#D93F21]'}`}>
                                {formatRupiah(Number(booking.total_harga))}
                            </p>
                            
                           <div className="mt-3 inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm w-fit md:w-full">
                                <CreditCard className="w-3.5 h-3.5 text-gray-400" /> 
                                {booking.payment_method?.nama_metode}
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>

            {(statusId !== 6 && statusId !== 4 && hasFooterActions) && (
                <CardFooter className="bg-slate-50/50 px-5 py-4 border-t border-dashed border-gray-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                    <div className="w-full sm:w-auto text-center sm:text-left">
                        {showCancel && (
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 bg-red-50/50 hover:bg-red-100 hover:text-red-700 border border-transparent hover:border-red-200 h-9 px-4 text-xs font-semibold transition-all duration-200 w-full sm:w-auto" 
                                onClick={onCancel}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Batalkan Booking
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        {showReschedule && (
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-white h-9 text-xs font-semibold shadow-sm w-full sm:w-auto" onClick={handleReschedule}>
                                <CalendarClock className="w-4 h-4 mr-2" /> Reschedule
                            </Button>
                        )}

                        {showPrint && (
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-white bg-white h-9 text-xs font-semibold shadow-sm w-full sm:w-auto" onClick={onPrint}>
                                <Printer className="w-4 h-4 mr-2" /> Cetak Tiket
                            </Button>
                        )}

                        {showUpload && (
                            <Button size="sm" className="bg-[#D93F21] hover:bg-[#b9351b] shadow-sm text-white h-9 px-5 text-xs font-bold w-full sm:w-auto" onClick={onUpload} disabled={isUploading}>
                                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                Upload Bukti
                            </Button>
                        )}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}