'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Booking } from '@/types';

export function useBookingHistory() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch Data
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/bookings?mode=history');
            setBookings(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat riwayat booking.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Upload bukti pembayaran
    const uploadPaymentProof = useCallback(async (bookingId: number, file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('bukti_pembayaran', file);
            await axios.post(`/api/bookings/${bookingId}/payment`, formData);
            
            toast.success("Bukti pembayaran berhasil diupload!");
            await fetchBookings();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal upload bukti.");
            return false;
        } finally {
            setIsUploading(false);
        }
    }, [fetchBookings]);

    // Cancel booking
    const cancelBooking = useCallback(async (bookingId: number) => {
        try {
            await axios.patch(`/api/bookings/${bookingId}/cancel`);
            toast.success("Booking dibatalkan.");
            await fetchBookings();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal membatalkan.");
            return false;
        }
    }, [fetchBookings]);

    // Filter bookings
    const activeBookings = bookings.filter(b => [1, 2, 3].includes(b.status_booking_id));
    const historyBookings = bookings.filter(b => [4, 5, 6].includes(b.status_booking_id));

    return {
        bookings,
        activeBookings,
        historyBookings,
        loading,
        isUploading,
        fetchBookings,
        uploadPaymentProof,
        cancelBooking
    };
}
