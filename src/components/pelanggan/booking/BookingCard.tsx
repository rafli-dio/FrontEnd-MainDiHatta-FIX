'use client';

import { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calendar, Clock, MapPin, CreditCard, Upload, Printer, Loader2, CheckCircle2
} from 'lucide-react';
import { formatRupiah, calculateDuration, getStatusConfig } from '@/lib/bookingUtils';

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

    return (
        <Card className={`overflow-hidden border-l-4 ${isHistory ? 'border-l-gray-300 opacity-80' : 'border-l-[#D93F21]'} shadow-sm hover:shadow-md transition-all duration-300 bg-white`}>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between md:justify-start gap-3 mb-1">
                            <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                {booking.kode_booking}
                            </span>
                            <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} hover:${statusConfig.bgColor}`}>
                                {statusConfig.label}
                            </Badge>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#D93F21]" /> 
                                {booking.lapangan?.nama_lapangan}
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
                    </div>

                    <div className="flex flex-col justify-between items-end min-w-[150px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                        <div className="text-right w-full">
                            <p className="text-xs text-gray-500 mb-1">Total Tagihan</p>
                            <p className="text-xl font-extrabold text-gray-900">{formatRupiah(Number(booking.total_harga))}</p>
                            <div className="mt-1 text-xs text-gray-500 flex items-center justify-end gap-1">
                                <CreditCard className="w-3 h-3" /> {booking.payment_method?.nama_metode}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full mt-6">
                            
                            {(statusId === 3 || statusId === 5) && (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" 
                                    onClick={onPrint}
                                >
                                    <Printer className="w-3.5 h-3.5 mr-2" /> Cetak Tiket
                                </Button>
                            )}

                            {!isHistory && (
                                <>
                                    {statusId === 1 && (
                                        <>
                                            <Button 
                                                size="sm" 
                                                className="w-full bg-[#D93F21] hover:bg-[#b9351b] shadow-sm" 
                                                onClick={onUpload}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                                ) : (
                                                    <Upload className="w-3.5 h-3.5 mr-2" />
                                                )}
                                                Upload Bukti
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="w-full text-red-600 border-red-200 hover:bg-red-50" 
                                                onClick={onCancel}
                                            >
                                                Batalkan
                                            </Button>
                                        </>
                                    )}

                                    {/* Status 2: Sedang Diverifikasi */}
                                    {statusId === 2 && (
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            className="w-full cursor-default opacity-80 bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-100"
                                        >
                                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Sedang Diverifikasi
                                        </Button>
                                    )}

                                    {statusId === 3 && (
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="w-full border-green-200 text-green-700 bg-green-50 cursor-default hover:bg-green-50 mb-2"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Siap Main!
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}