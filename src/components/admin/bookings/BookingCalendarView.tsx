'use client';

import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Booking } from '@/types';

interface BookingCalendarViewProps {
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    bookedDays: Date[];
    bookingsOnSelectedDate: Booking[];
    onViewDetail: (booking: Booking) => void;
}

export default function BookingCalendarView({
    selectedDate,
    setSelectedDate,
    bookedDays,
    bookingsOnSelectedDate,
    onViewDetail
}: BookingCalendarViewProps) {

    const getStatusBadge = (id: number) => {
        switch(id) {
            case 1: return <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200">Pending</Badge>;
            case 2: return <Badge className="bg-blue-500 hover:bg-blue-600">Verifikasi</Badge>;
            case 3: return <Badge className="bg-green-600 hover:bg-green-700">OK</Badge>;
            case 5: return <Badge variant="outline" className="bg-gray-100">Selesai</Badge>;
            default: return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Kalender */}
            <Card className="flex-none w-full lg:w-auto">
                <CardContent className="p-4 flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border shadow-sm"
                        disabled={{ before: new Date() }} 
                        modifiers={{
                            booked: bookedDays
                        }}
                        modifiersStyles={{
                            booked: { fontWeight: 'bold', color: '#D93F21', textDecoration: 'underline' }
                        }}
                    />
                </CardContent>
            </Card>

            {/* List Jadwal */}
            <Card className="flex-1 w-full min-h-[350px]">
                <CardHeader className="border-b pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-[#D93F21]" />
                        Jadwal: {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: localeId }) : '-'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    {bookingsOnSelectedDate.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>Tidak ada jadwal booking pada tanggal ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bookingsOnSelectedDate
                                .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
                                .map((booking) => (
                                <div 
                                    key={booking.id} 
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#D93F21]/30 hover:shadow-sm transition-all cursor-pointer bg-white"
                                    onClick={() => onViewDetail(booking)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-orange-50 text-[#D93F21] p-2 rounded-md font-mono text-sm font-bold text-center w-24">
                                            {booking.jam_mulai.substring(0, 5)} <br/> 
                                            <span className="text-xs font-normal text-gray-500">s/d</span> <br/>
                                            {booking.jam_selesai.substring(0, 5)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{booking.nama_pengirim || booking.user?.name || 'Tamu'}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <MapPin className="w-3 h-3" /> {booking.lapangan?.nama_lapangan}
                                                {booking.acara && <span className="bg-gray-100 px-1.5 rounded">Kegiatan: {booking.acara}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(booking.status_booking_id)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}