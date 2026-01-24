'use client';

import QRCode from "react-qr-code";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, User } from 'lucide-react';
import { Booking } from '@/types';

interface BookingTicketProps {
    booking: Booking;
    formatDate: (date: string) => string;
}

export default function BookingTicket({ booking, formatDate }: BookingTicketProps) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 relative text-left mx-6 md:mx-8 mb-8">
            {/* Cutout Effect */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full border-r border-gray-200"></div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full border-l border-gray-200"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kode Booking</p>
                    <p className="text-xl font-mono font-black text-gray-900 tracking-wide">{booking.kode_booking}</p>
                </div>
                <div className="bg-white p-1 rounded-lg border border-gray-100">
                    <QRCode value={booking.kode_booking} size={50} />
                </div>
            </div>

            <Separator className="mb-4 border-dashed border-gray-300" />

            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D93F21] mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Lapangan</p>
                        <p className="font-bold text-gray-800">{booking.lapangan?.nama_lapangan}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Tanggal</p>
                            <p className="text-sm font-medium text-gray-800">{formatDate(booking.tanggal_booking)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Jam Main</p>
                            <p className="text-sm font-medium text-gray-800">{booking.jam_mulai.substring(0,5)} - {booking.jam_selesai.substring(0,5)}</p>
                        </div>
                    </div>
                </div>

                {booking.acara && (
                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Kegiatan/Club</p>
                            <p className="text-sm font-medium text-gray-800">{booking.acara}</p>
                        </div>
                    </div>
                )}
            </div>

            <Separator className="my-4 border-dashed border-gray-300" />

            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                {booking.status_booking_id === 1 && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu Bayar</Badge>}
                {booking.status_booking_id === 2 && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Verifikasi Admin</Badge>}
                {booking.status_booking_id === 3 && <Badge className="bg-green-600 hover:bg-green-700">Terkonfirmasi</Badge>}
            </div>
        </div>
    );
}