'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { sweetAlert } from '@/lib/sweetAlert';

export function useBookingAdminPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("table");
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Process Auto Finish (Defensive)
    const processAutoFinish = useCallback((data: any[]) => {
        // Pastikan input benar-benar array
        if (!Array.isArray(data)) return [];

        const now = new Date();

        return data.map((booking) => {
            // Safety check: jika booking null/undefined
            if (!booking) return booking;

            const bookingEndString = `${booking.tanggal_booking}T${booking.jam_selesai}`;
            const bookingEndDate = new Date(bookingEndString);

            if (booking.status_booking_id === 3 && now > bookingEndDate) {
                return {
                    ...booking,
                    status_booking_id: 5, 
                    status_booking: {
                        ...(booking.status_booking || {}), // Handle jika status_booking null
                        id: 5,
                        nama_status: 'Selesai', 
                        color: 'success'
                    }
                } as Booking; 
            }
            return booking;
        });
    }, []);

    // 2. Fetch Bookings (Anti-Crash)
    const fetchBookings = useCallback(async () => {
        try {
            const response = await axios.get('/api/bookings');
            
            // --- VALIDASI RESPONS API ---
            const rawData = response.data;
            let safeData: any[] = [];

            if (Array.isArray(rawData)) {
                safeData = rawData;
            } else if (rawData?.data && Array.isArray(rawData.data)) {
                // Handle Pagination Laravel { data: [...] }
                safeData = rawData.data;
            } else {
                console.warn("Format data booking tidak valid:", rawData);
                safeData = [];
            }
            
            const processedData = processAutoFinish(safeData);
            setBookings(processedData);

        } catch (error) {
            console.error("Fetch error:", error);
            // JANGAN biarkan bookings undefined/null, set ke empty array
            setBookings([]); 
        } finally {
            setLoading(false);
        }
    }, [processAutoFinish]);

    useEffect(() => {
        setLoading(true); 
        fetchBookings();

        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
    }, [fetchBookings]);

    // 3. Filter & Search (Safe Logic)
    // Pastikan bookings selalu array sebelum difilter
    const safeBookings = Array.isArray(bookings) ? bookings : [];

    const filteredBookings = safeBookings.filter(item => {
        if (!item) return false; // Safety check

        const searchLower = searchQuery.toLowerCase();
        
        // Gunakan Optional Chaining (?.) untuk mencegah crash jika property hilang
        const matchSearch = 
            item.kode_booking?.toLowerCase().includes(searchLower) || 
            item.user?.name?.toLowerCase().includes(searchLower) ||
            (item.nama_pengirim && item.nama_pengirim.toLowerCase().includes(searchLower)) ||
            false;
            
        const matchStatus = filterStatus === 'all' || item.status_booking_id?.toString() === filterStatus;
        
        return matchSearch && matchStatus;
    });

    // Pagination Logic
    const totalData = filteredBookings.length;
    const totalPages = Math.ceil(totalData / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

    // Calendar Filter Logic
    const bookingsOnSelectedDate = safeBookings.filter(b => 
        selectedDate && 
        b?.tanggal_booking === format(selectedDate, 'yyyy-MM-dd') && 
        b?.status_booking_id !== 4 
    );

    const bookedDays = safeBookings
        .filter(b => b?.status_booking_id !== 4 && b?.tanggal_booking)
        .map(b => new Date(b.tanggal_booking));

    // Handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetail = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    const handleApprove = async (id: number) => {
        const result = await sweetAlert.confirm(
            'Konfirmasi Booking',
            'Apakah Anda yakin ingin mengkonfirmasi booking ini?'
        );
        
        if (!result.isConfirmed) return;
        
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
        const result = await sweetAlert.confirm(
            'Tolak Booking',
            'Apakah Anda yakin ingin menolak booking ini?',
            'warning'
        );
        
        if (!result.isConfirmed) return;
        
        setIsProcessing(true);
        try {
            await axios.patch(`/api/bookings/${id}/cancel`); 
            toast.success("Booking dibatalkan.");
            
            setIsDialogOpen(false);
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal membatalkan.");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        bookings: currentItems,
        allBookings: safeBookings, // Gunakan safeBookings
        loading,
        totalData,
        viewMode, setViewMode,
        searchQuery, setSearchQuery,
        filterStatus, setFilterStatus,
        selectedDate, setSelectedDate,
        bookingsOnSelectedDate,
        bookedDays,
        currentPage,
        itemsPerPage,
        totalPages,
        handlePageChange,
        selectedBooking,
        isDialogOpen, setIsDialogOpen,
        isProcessing,
        handleViewDetail,
        handleApprove,
        handleReject,
        fetchBookings
    };
}