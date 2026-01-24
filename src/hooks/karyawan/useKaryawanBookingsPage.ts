'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Booking } from '@/types';

export function useKaryawanBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [viewMode, setViewMode] = useState("table");

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Fetch Bookings (Defensive)
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/bookings');
            
            // Validasi Data: Pastikan Array
            const rawData = response.data?.data || response.data;
            if (Array.isArray(rawData)) {
                setBookings(rawData);
            } else {
                console.warn("Format data booking tidak valid:", rawData);
                setBookings([]); // Set array kosong agar tidak crash
            }

        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data booking.");
            setBookings([]); // Reset ke array kosong jika error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
    }, []);

    // --- 2. LOGIC FILTERING (Defensive) ---
    // Pastikan bookings selalu dianggap array
    const safeBookings = Array.isArray(bookings) ? bookings : [];

    const filteredBookingsTable = safeBookings.filter((item) => {
        // Safety Check per Item
        if (!item) return false;

        const query = searchQuery.toLowerCase();
        
        // Gunakan Optional Chaining (?.) untuk mencegah crash jika property hilang
        const matchesSearch = 
            item.kode_booking?.toLowerCase().includes(query) ||
            item.user?.name?.toLowerCase().includes(query) ||
            (item.nama_pengirim && item.nama_pengirim.toLowerCase().includes(query)) ||
            false;

        const matchesStatus = statusFilter === 'all' || item.status_booking_id?.toString() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const bookingsOnSelectedDate = safeBookings.filter(b => 
        selectedDate && 
        b?.tanggal_booking === format(selectedDate, 'yyyy-MM-dd') && 
        b?.status_booking_id !== 4 
    );

    const bookedDays = safeBookings
        .filter(b => b?.status_booking_id !== 4 && b?.tanggal_booking)
        .map(b => new Date(b.tanggal_booking));

    
    const handleViewDetail = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    const handleApprove = async (id: number) => {
        if(!confirm("Konfirmasi booking ini? Pastikan pembayaran valid.")) return;
        setIsProcessing(true);
        try {
            await axios.patch(`/api/bookings/${id}/status`, { status_booking_id: 3 });
            toast.success("Booking berhasil dikonfirmasi!");
            setIsDialogOpen(false);
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal konfirmasi.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (id: number) => {
        if(!confirm("Tolak booking ini? Data akan ditandai batal.")) return;
        setIsProcessing(true);
        try {
            await axios.patch(`/api/bookings/${id}/cancel`);
            toast.success("Booking ditolak/dibatalkan.");
            setIsDialogOpen(false);
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menolak.");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        bookings,
        loading,
        viewMode,
        searchQuery,
        statusFilter,
        selectedDate,
        selectedBooking,
        isDialogOpen,
        isProcessing,
        filteredBookingsTable,
        bookingsOnSelectedDate,
        bookedDays,
        setViewMode,
        setSearchQuery,
        setStatusFilter,
        setSelectedDate,
        setIsDialogOpen,
        fetchBookings,
        handleViewDetail,
        handleApprove,
        handleReject
    };
}