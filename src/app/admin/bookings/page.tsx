'use client';

import Link from 'next/link';
// 1. FIX: Gabungkan semua icon dari lucide-react di sini
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
import BookingCalendarView from '@/components/admin/bookings/BookingCalendarView'; 

export default function BookingAdminPage() {
    const {
        // Data & State
        bookings,           // Data paginated untuk tabel
        loading,
        totalData,          // Total data setelah filter
        
        // View State
        viewMode,
        setViewMode,

        // Filters
        searchQuery, setSearchQuery,
        filterStatus, setFilterStatus,
        
        // Calendar Data
        selectedDate, setSelectedDate,
        bookingsOnSelectedDate,
        bookedDays,

        // Pagination
        currentPage,
        totalPages,
        handlePageChange,

        // Dialog & Actions
        selectedBooking,
        isDialogOpen, setIsDialogOpen,
        isProcessing,
        handleViewDetail,
        handleApprove,
        handleReject,
        fetchBookings
    } = useBookingAdminPage();

    return (
        <div className="space-y-6 pb-20 p-6"> {/* Tambahkan padding container */}
            
            {/* --- HEADER SECTION --- */}
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

            {/* --- TABS VIEW SWITCHER --- */}
            <Tabs defaultValue="table" value={viewMode} onValueChange={setViewMode} className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6 p-1 bg-gray-100/80">
                    <TabsTrigger value="table" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <List className="w-4 h-4 mr-2"/> Daftar List
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <CalendarIcon className="w-4 h-4 mr-2"/> Kalender Jadwal
                    </TabsTrigger>
                </TabsList>

                {/* --- VIEW 1: TABLE LIST --- */}
                <TabsContent value="table" className="space-y-6 mt-0 animate-in fade-in-50 duration-300">
                    
                    {/* Filter Component */}
                    <BookingFilters 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />

                    {/* Table Container */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <BookingTable 
                            bookings={bookings}
                            loading={loading}
                            onView={handleViewDetail}
                        />
                        
                        {/* Pagination Controls */}
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

                {/* --- VIEW 2: CALENDAR --- */}
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

            {/* --- SHARED DIALOG DETAIL --- */}
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