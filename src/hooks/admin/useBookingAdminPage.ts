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
    const [completionStatus, setCompletionStatus] = useState<'belum' | 'selesai'>('belum');

    const processAutoFinish = useCallback((data: any[]) => {
        if (!Array.isArray(data)) return [];

        const now = new Date();

        return data.map((booking) => {
            if (!booking) return booking;

            const bookingEndString = `${booking.tanggal_booking}T${booking.jam_selesai}`;
            const bookingEndDate = new Date(bookingEndString);

            if (booking.status_booking_id === 2 && now > bookingEndDate) {
                return {
                    ...booking,
                    status_booking_id: 4,
                    status_booking: {
                        ...(booking.status_booking || {}),
                        id: 4,
                        nama_status: 'Selesai',
                        color: 'success'
                    }
                } as Booking;
            }
            return booking;
        });
    }, []);

    const fetchBookings = useCallback(async () => {
        try {
            const response = await axios.get('/api/bookings');

            const rawData = response.data;
            let safeData: any[] = [];

            if (Array.isArray(rawData)) {
                safeData = rawData;
            } else if (rawData?.data && Array.isArray(rawData.data)) {
                safeData = rawData.data;
            } else {
                console.warn("Format data booking tidak valid:", rawData);
                safeData = [];
            }

            const processedData = processAutoFinish(safeData);
            setBookings(processedData);

        } catch (error) {
            console.error("Fetch error:", error);
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

    // 3. Filter & Search & SORT (Logic Baru new)
    const safeBookings = Array.isArray(bookings) ? bookings : [];

    const filteredBookings = safeBookings
        .filter(item => {
            if (!item) return false;

            const searchLower = searchQuery.toLowerCase();

            const matchSearch =
                item.kode_booking?.toLowerCase().includes(searchLower) ||
                item.user?.name?.toLowerCase().includes(searchLower) ||
                (item.nama_pengirim && item.nama_pengirim.toLowerCase().includes(searchLower)) ||
                false;

            const matchStatus = filterStatus === 'all' || item.status_booking_id?.toString() === filterStatus;

            const isCompleted = [3, 4, 5].includes(item.status_booking_id);
            const matchCompletion = completionStatus === 'selesai' ? isCompleted : !isCompleted;

            return matchSearch && matchStatus && matchCompletion;
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.tanggal_booking}T${a.jam_mulai}`);
            const dateB = new Date(`${b.tanggal_booking}T${b.jam_mulai}`);
            const now = new Date();

            const diffA = dateA.getTime() - now.getTime();
            const diffB = dateB.getTime() - now.getTime();

            const isFutureA = diffA >= 0;
            const isFutureB = diffB >= 0;

            if (isFutureA && !isFutureB) return -1;
            if (!isFutureA && isFutureB) return 1;

            if (isFutureA && isFutureB) {
                return diffA - diffB;
            }

            return diffB - diffA;
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
        ![3, 5].includes(b?.status_booking_id)
    );

    const bookedDays = safeBookings
        .filter(b => ![3, 5].includes(b?.status_booking_id) && b?.tanggal_booking)
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
            await axios.patch(`/api/bookings/${id}/status`, { status_booking_id: 2 });
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
        allBookings: safeBookings,
        loading,
        totalData,
        viewMode, setViewMode,
        searchQuery, setSearchQuery,
        filterStatus, setFilterStatus,
        completionStatus, setCompletionStatus,
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