'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Booking } from '@/types';

export function useBookingHistory() {
    // 1. Inisialisasi state sudah benar
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch Data
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/bookings?mode=history');
            
            // 2. DEBUGGING: Cek apa isi response sebenarnya
            console.log("Cek Respon API:", response.data); 

            // 3. VALIDASI: Pastikan data yang masuk adalah Array
            if (Array.isArray(response.data)) {
                setBookings(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                // Jaga-jaga kalau response bentuknya { data: [...] } (Pagination Laravel)
                setBookings(response.data.data);
            } else {
                console.warn("Format data API salah, diharapkan array:", response.data);
                setBookings([]); // Set kosong agar tidak error
            }

        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat riwayat booking.");
            setBookings([]); // Pastikan tetap array kosong kalau error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // ... (Fungsi uploadPaymentProof dan cancelBooking biarkan saja, sudah aman) ...
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


    const safeBookings = Array.isArray(bookings) ? bookings : [];

    const activeBookings = safeBookings.filter(b => [1, 2, 3].includes(b.status_booking_id));
    const historyBookings = safeBookings.filter(b => [4, 5, 6].includes(b.status_booking_id));

    return {
        bookings: safeBookings, // Return yang aman
        activeBookings,
        historyBookings,
        loading,
        isUploading,
        fetchBookings,
        uploadPaymentProof,
        cancelBooking
    };
}