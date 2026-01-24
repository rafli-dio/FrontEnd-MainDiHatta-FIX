'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
// Kita reuse komponen form yang sudah ada di folder admin (karena logicnya sama)
// Pastikan path import ini benar sesuai struktur folder Anda
import CreateBookingForm from '@/components/admin/bookings/CreateBookingForm';

export default function KaryawanCreateBookingPage() {
    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/karyawan/dashboard">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Input Booking Manual</h1>
                    <p className="text-gray-500 text-sm">Catat penyewaan lapangan untuk pelanggan yang datang langsung (Walk-in).</p>
                </div>
            </div>

            {/* Panggil Form Component yang sudah ada */}
            <CreateBookingForm />
        </div>
    );
}