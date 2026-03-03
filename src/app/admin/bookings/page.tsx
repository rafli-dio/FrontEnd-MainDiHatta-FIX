'use client';

import { useState } from 'react'; // Import useState
import Link from 'next/link';
import {
    Plus,
    RefreshCcw,
    List,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Hooks & Components
import { useBookingAdminPage } from '@/hooks/admin/useBookingAdminPage';
import BookingFilters from '@/components/admin/bookings/BookingFilters';
import BookingTable from '@/components/admin/bookings/BookingTable';
import BookingDetailDialog from '@/components/admin/bookings/BookingDetailDialog';
import EditBookingDialog from '@/components/admin/bookings/EditBookingDialog'; // IMPORT DIALOG EDIT (Pastikan path sesuai)
import BookingCalendarView from '@/components/admin/bookings/BookingCalendarView';
import { Booking } from '@/types'; // Import tipe Booking

export default function BookingAdminPage() {
    const {
        bookings,
        loading,
        totalData,
        viewMode,
        setViewMode,
        searchQuery, setSearchQuery,
        filterStatus, setFilterStatus,
        selectedDate, setSelectedDate,
        bookingsOnSelectedDate,
        bookedDays,
        currentPage,
        totalPages,
        handlePageChange,
        selectedBooking, // Ini untuk Detail View
        isDialogOpen, setIsDialogOpen, // Ini untuk Detail Dialog
        isProcessing,
        handleViewDetail,
        handleApprove,
        handleReject,
        fetchBookings,
        completionStatus, setCompletionStatus,
    } = useBookingAdminPage();

    // --- STATE TAMBAHAN UNTUK EDIT / RESCHEDULE ---
    const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Handler ketika tombol Pensil di tabel diklik
    const handleEditClick = (booking: Booking) => {
        setBookingToEdit(booking);
        setIsEditOpen(true);
    };

    // Handler setelah sukses edit (Refresh data)
    const handleEditSuccess = () => {
        fetchBookings();
    };

    return (
        <div className="space-y-6 pb-20 p-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Booking</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Validasi pembayaran dan kelola jadwal lapangan secara real-time.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchBookings}
                        title="Refresh Data"
                        disabled={loading}
                        className="h-10 w-10"
                    >
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Link href={selectedDate ? `/admin/bookings/create?date=${String(selectedDate.getFullYear()).padStart(4, '0')}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : "/admin/bookings/create"}>
                        <Button className="bg-[#D93F21] hover:bg-[#b9351b] h-10 px-4">
                            <Plus className="w-4 h-4 mr-2" /> Input Manual
                        </Button>
                    </Link>
                </div>
            </div>

            {/* --- TABS VIEW --- */}
            <Tabs defaultValue="table" value={viewMode} onValueChange={setViewMode} className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6 p-1 bg-gray-100/80">
                    <TabsTrigger value="table" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <List className="w-4 h-4 mr-2" /> Daftar List
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <CalendarIcon className="w-4 h-4 mr-2" /> Kalender Jadwal
                    </TabsTrigger>
                </TabsList>

                {/* --- TABEL VIEW --- */}
                <TabsContent value="table" className="space-y-6 mt-0 animate-in fade-in-50 duration-300">

                    <Tabs value={completionStatus} onValueChange={(val) => setCompletionStatus(val as 'belum' | 'selesai')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100/80 rounded-xl">
                            <TabsTrigger value="belum" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2">
                                Belum Selesai (Aktif)
                            </TabsTrigger>
                            <TabsTrigger value="selesai" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2">
                                Sudah Selesai (Riwayat)
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <BookingFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <BookingTable
                            bookings={bookings}
                            loading={loading}
                            onView={handleViewDetail}
                            onEdit={handleEditClick} // Masukkan Handler Edit di sini
                        />

                        {/* PAGINATION */}
                        {!loading && totalData > 0 && (
                            <div className="flex items-center justify-between p-4 border-t bg-gray-50/50">
                                <div className="text-sm text-gray-500">
                                    Menampilkan <strong>{bookings.length}</strong> dari <strong>{totalData}</strong> data
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium px-2 min-w-[80px] text-center">
                                        Hal {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* --- CALENDAR VIEW --- */}
                <TabsContent value="calendar" className="mt-0 animate-in fade-in-50 duration-300">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
                        <BookingCalendarView
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            bookedDays={bookedDays}
                            bookingsOnSelectedDate={bookingsOnSelectedDate}
                            onViewDetail={handleViewDetail}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* --- DIALOGS --- */}

            {/* 1. Detail Dialog (Approve/Reject) */}
            <BookingDetailDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                booking={selectedBooking}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={isProcessing}
                onRefresh={fetchBookings}
            />

            {/* 2. Edit / Reschedule Dialog (BARU) */}
            {bookingToEdit && (
                <EditBookingDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    booking={bookingToEdit}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
}