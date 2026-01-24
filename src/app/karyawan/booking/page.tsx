'use client';

import Link from 'next/link';
import { Plus, RefreshCcw, List, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 1. Import Custom Hook Logika
import { useKaryawanBookingsPage } from '@/hooks/karyawan/useKaryawanBookingsPage';

// 2. Import Komponen UI
import BookingFilter from '@/components/karyawan/bookings/BookingFilter';
import BookingCalendarView from '@/components/karyawan/bookings/BookingCalendarView';
// Reuse komponen dari folder admin untuk konsistensi
import BookingTable from '@/components/admin/bookings/BookingTable'; 
import BookingDetailDialog from '@/components/admin/bookings/BookingDetailDialog'; 

export default function KaryawanBookingsPage() {
    // 3. Panggil Logika dari Hook
    const {
        // State & Data
        loading,
        viewMode,
        searchQuery,
        statusFilter,
        selectedDate,
        selectedBooking,
        isDialogOpen,
        isProcessing,
        
        // Data Terfilter / Terhitung
        filteredBookingsTable,
        bookingsOnSelectedDate,
        bookedDays,

        // Setters
        setViewMode,
        setSearchQuery,
        setStatusFilter,
        setSelectedDate,
        setIsDialogOpen,

        // Actions
        fetchBookings,
        handleViewDetail,
        handleApprove,
        handleReject
    } = useKaryawanBookingsPage();

    return (
        <div className="space-y-6 pb-20 p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Booking</h1>
                    <p className="text-gray-500 text-sm">Pantau jadwal dan konfirmasi pembayaran pelanggan.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchBookings} title="Refresh Data" disabled={loading}>
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Link href="/karyawan/booking/create">
                        <Button className="bg-[#D93F21] hover:bg-[#b9351b]">
                            <Plus className="w-4 h-4 mr-2" /> Input Manual
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs View Switcher (Tabel vs Kalender) */}
            <Tabs defaultValue="table" value={viewMode} onValueChange={setViewMode} className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
                    <TabsTrigger value="table"><List className="w-4 h-4 mr-2"/> Daftar List</TabsTrigger>
                    <TabsTrigger value="calendar"><CalendarIcon className="w-4 h-4 mr-2"/> Kalender Jadwal</TabsTrigger>
                </TabsList>

                {/* VIEW 1: TABEL LIST */}
                <TabsContent value="table" className="space-y-6 mt-0">
                    <BookingFilter 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                    <BookingTable 
                        loading={loading}
                        bookings={filteredBookingsTable}
                        onView={handleViewDetail}
                    />
                </TabsContent>

                {/* VIEW 2: KALENDER JADWAL */}
                <TabsContent value="calendar" className="mt-0">
                    <BookingCalendarView 
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        bookedDays={bookedDays}
                        bookingsOnSelectedDate={bookingsOnSelectedDate}
                        onViewDetail={handleViewDetail}
                    />
                </TabsContent>
            </Tabs>

            {/* Modal Detail Booking (Shared) */}
            <BookingDetailDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                booking={selectedBooking}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={isProcessing}
                onRefresh={fetchBookings}
            />
        </div>
    );
}