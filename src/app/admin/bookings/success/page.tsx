'use client';

import { Suspense } from 'react'; 
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, List, PlusCircle, Loader2 } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function SuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('id');

    return (
        <Card className="max-w-md w-full shadow-xl border-t-4 border-t-green-600">
            <CardContent className="pt-10 pb-8 px-8 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 p-4">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Booking Berhasil Disimpan!</h1>
                    <p className="text-gray-500">
                        Data penyewaan lapangan telah berhasil dicatat ke dalam sistem.
                    </p>
                    {bookingId && (
                        <div className="mt-2 inline-block bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-600">
                            ID Booking: #{bookingId}
                        </div>
                    )}
                </div>
                <div className="grid gap-3 pt-4">
                    <Link href="/admin/bookings" className="w-full">
                        <Button variant="outline" className="w-full border-gray-300">
                            <List className="w-4 h-4 mr-2" />
                            Kembali ke Daftar Booking
                        </Button>
                    </Link>

                    <Link href="/admin/bookings/create" className="w-full">
                        <Button className="w-full bg-[#D93F21] hover:bg-[#b9351b]">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Input Booking Baru Lagi
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminBookingSuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#D93F21]" />
                    <p className="text-gray-500">Memuat data...</p>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}