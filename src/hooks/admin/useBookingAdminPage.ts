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

    const processAutoFinish = useCallback((data: Booking[]) => {
        const now = new Date();

        return data.map((booking) => {
            const bookingEndString = `${booking.tanggal_booking}T${booking.jam_selesai}`;
            const bookingEndDate = new Date(bookingEndString);

            if (booking.status_booking_id === 3 && now > bookingEndDate) {
                return {
                    ...booking,
                    status_booking_id: 5, 
                    status_booking: {
                        ...booking.status_booking,
                        id: 5,
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
            const rawData = Array.isArray(response.data?.data) 
                ? response.data.data 
                : Array.isArray(response.data) ? response.data : [];
            
            const processedData = processAutoFinish(rawData);
            
            setBookings(processedData);
        } catch (error) {
            console.error("Fetch error:", error);
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

    const filteredBookings = bookings.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        const matchSearch = 
            item.kode_booking.toLowerCase().includes(searchLower) || 
            item.user?.name.toLowerCase().includes(searchLower) ||
            (item.nama_pengirim && item.nama_pengirim.toLowerCase().includes(searchLower));
        const matchStatus = filterStatus === 'all' || item.status_booking_id.toString() === filterStatus;
        
        return matchSearch && matchStatus;
    });

    const totalData = filteredBookings.length;
    const totalPages = Math.ceil(totalData / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);


    const bookingsOnSelectedDate = bookings.filter(b => 
        selectedDate && 
        b.tanggal_booking === format(selectedDate, 'yyyy-MM-dd') && 
        b.status_booking_id !== 4 
    );

    const bookedDays = bookings
        .filter(b => b.status_booking_id !== 4)
        .map(b => new Date(b.tanggal_booking));

    
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
            const response = await axios.patch(`/api/bookings/${id}/status`, { status_booking_id: 3 });
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
            const response = await axios.patch(`/api/bookings/${id}/cancel`); 
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
        allBookings: bookings, 
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