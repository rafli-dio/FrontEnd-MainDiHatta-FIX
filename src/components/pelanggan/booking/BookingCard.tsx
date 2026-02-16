'use client';

import { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card'; 
import { Badge } from '@/components/ui/badge';
import {
    Calendar, Clock, MapPin, CreditCard, Upload, Printer, Loader2, CheckCircle2, AlertTriangle, MessageCircle, CalendarClock
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

    // 2. Link WA untuk Maintenance (ID 6)
    const handleContactMaintenance = () => {
        const message = `Halo Admin Hatta Sport. Saya melihat status booking #${booking.kode_booking} (Tanggal: ${booking.tanggal_booking}) dibatalkan admin (Maintenance). Mohon info refund/reschedule.`;
        window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // 3. Link WA untuk Ajukan Reschedule
    const handleReschedule = () => {
        const message = `Halo Admin. Saya ingin reschedule booking #${booking.kode_booking} (Tgl: ${booking.tanggal_booking}, Jam: ${booking.jam_mulai}). Mohon info slot pengganti.`;
        window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    };

    let borderClass = 'border-l-[#D93F21]';
    if (statusId === 6) borderClass = 'border-l-red-600 bg-red-50/20'; 
    else if (isHistory) borderClass = 'border-l-gray-300 opacity-90';

    return (
        <Card className={`overflow-hidden border-l-4 ${borderClass} shadow-sm hover:shadow-md transition-all duration-300 bg-white`}>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between md:justify-start gap-3 mb-1">
                            <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                {booking.kode_booking}
                            </span>
                            
                            {statusId === 6 ? (
                                <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 shadow-none">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Dibatalkan Admin
                                </Badge>
                            ) : (
                                <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} hover:${statusConfig.bgColor} shadow-none`}>
                                    {statusConfig.label}
                                </Badge>
                            )}
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#D93F21]" /> 
                                {booking.lapangan?.nama_lapangan || 'Lapangan Hatta Sport'}
                            </h3>
                            <div className="text-sm text-gray-600 mt-2 space-y-1.5">
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" /> 
                                    {formatDate(booking.tanggal_booking)}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" /> 
                                    {booking.jam_mulai} - {booking.jam_selesai} ({durasi} Jam)
                                </p>
                            </div>
                        </div>
                        
                        {booking.acara && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md inline-block border border-gray-100">
                                Club: <span className="font-bold text-gray-700">{booking.acara}</span>
                            </div>
                        )}

                        {statusId === 6 && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                                <p className="text-xs text-red-700 font-medium mb-2 leading-relaxed">
                                    ⚠️ <strong>Mohon Maaf.</strong> Booking ini dibatalkan karena ada maintenance lapangan mendadak. 
                                    Silakan hubungi admin untuk <strong>Refund</strong> atau <strong>Reschedule</strong>.
                                </p>
                                <Button 
                                    onClick={handleContactMaintenance}
                                    size="sm"
                                    className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto shadow-sm"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Hubungi Admin (WA)
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between items-end min-w-[150px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                        <div className="text-right w-full">
                            <p className="text-xs text-gray-500 mb-1">Total Tagihan</p>
                            <p className={`text-xl font-extrabold ${statusId === 6 ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                {formatRupiah(Number(booking.total_harga))}
                            </p>
                            <div className="mt-1 text-xs text-gray-500 flex items-center justify-end gap-1">
                                <CreditCard className="w-3 h-3" /> {booking.payment_method?.nama_metode}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            {statusId !== 6 && statusId !== 4 && (
                <CardFooter className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-wrap justify-end gap-2">
                    
                    {(statusId === 3 || statusId === 5) && (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-300 text-gray-700 hover:bg-white bg-white h-9" 
                            onClick={onPrint}
                        >
                            <Printer className="w-4 h-4 mr-2" /> Cetak Tiket
                        </Button>
                    )}

                    {!isHistory && (
                        <>
                            {canReschedule() && (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-white h-9"
                                    onClick={handleReschedule}
                                >
                                    <CalendarClock className="w-4 h-4 mr-2" /> Reschedule
                                </Button>
                            )}

                            {statusId === 1 && (
                                <Button 
                                    size="sm" 
                                    className="bg-[#D93F21] hover:bg-[#b9351b] shadow-sm text-white h-9 px-4" 
                                    onClick={onUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 mr-2" />
                                    )}
                                    Upload Bukti
                                </Button>
                            )}

                            {statusId === 1 && (
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-red-600 hover:bg-red-50 h-9" 
                                    onClick={onCancel}
                                >
                                    Batalkan
                                </Button>
                            )}

                            {statusId === 2 && (
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    className="cursor-default opacity-80 bg-blue-50 text-blue-700 border border-blue-100 h-9"
                                >
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sedang Diverifikasi
                                </Button>
                            )}

                            {statusId === 3 && (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-green-200 text-green-700 bg-green-50 cursor-default hover:bg-green-50 h-9"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Siap Main!
                                </Button>
                            )}
                        </>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}