'use client';

// 1. Tambahkan import Suspense dari 'react'
import { Suspense } from 'react'; 
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import CreateBookingForm from '@/components/admin/bookings/CreateBookingForm';

export default function AdminCreateBookingPage() {
    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/bookings">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Input Booking Manual</h1>
                    <p className="text-gray-500 text-sm">Catat penyewaan lapangan untuk pelanggan offline/telepon.</p>
                </div>
            </div>

            {/* 2. Bungkus komponen form dengan Suspense */}
            <Suspense fallback={<div>Memuat Form...</div>}>
                <CreateBookingForm />
            </Suspense>
        </div>
    );
}