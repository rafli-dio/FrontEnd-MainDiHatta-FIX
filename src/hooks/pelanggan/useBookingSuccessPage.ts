'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';
import { Booking } from '@/types';

export function useBookingSuccessPage() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('id');

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) {
            setLoading(false);
            return;
        }

        const fetchBooking = async () => {
            try {
                const res = await axios.get(`/api/bookings/${bookingId}`);
                setBooking(res.data?.data || res.data);
            } catch (error) {
                console.error("Gagal memuat booking", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const formatRupiah = (num: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    
    const formatDate = (dateString: string) => 
        new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const handlePrint = () => {
        window.print();
    };

    return {
        booking,
        loading,
        bookingId,
        formatRupiah,
        formatDate,
        handlePrint
    };
}